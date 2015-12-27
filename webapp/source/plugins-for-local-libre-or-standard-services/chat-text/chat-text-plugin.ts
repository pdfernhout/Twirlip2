"use strict";

import m = require("mithril");
import sanitizeHTML = require("../../sanitizeHTML");

var currentChannel = "test";
var channelChangeInProgress = false;
var currentMessages = [];
var currentMessage = "";
var currentUser = "test@example.com";

var polling = false;
var pollingTimeout = null;

export function initialize() {
    // TODO: Somehow get a list of relevant messages out of all the ones out there now or later
    changeChannelClicked();
    
    console.log("Chat Text plugin initialized");
}

function setPoll(value) {
    polling = value;
    
    if (!polling && pollingTimeout) {
        clearTimeout(pollingTimeout);
        pollingTimeout = null;
        console.log("stop polling for chat messages");
        return;
    }
    
    if (!pollingTimeout) {
        pollingTimeout = setTimeout(poll, 5000);
        console.log("start polling for chat messages");
    }
}

function poll() {
    console.log("polling");
    pollingTimeout = null;
    
    changeChannelClicked(() => {
        pollingTimeout = setTimeout(poll, 5000);
    });
}

function displayChatChannel() {
    return m("div", [
        "Channel:",
        m("input", {
            value: currentChannel,
            onchange: m.withAttr("value", currentChannelChanged), 
            onkeyup: inputKeyPress.bind(null, changeChannelClicked.bind(null, null)),
            size: "30"
        }),
        m("button", {onclick: changeChannelClicked.bind(null, null)}, "Change channel")
    ]
    );
}

function currentChannelChanged(channel) {
    currentChannel = channel;
}

function changeChannelClicked(callback = null, event = null) {
    console.log("changeChannelClicked", changeChannelClicked);
    // TODO: Somehow get a list of relevant messages out of all the ones out there
    // TODO: Then somehow track any new messages on that channel from others
    
    channelChangeInProgress = true;
    
    m.request({
        method: "POST", 
        url: "/api/pointrel20151212/store", 
        data: {
            // index: "chat-index-get-all-messages-for-channel",
            action: "index/allC",
            a: pointerForCurrentChannel(),
            // a: "pointrel:ChatChannel:" + currentChannel
            b: "containsMessage",
            // TODO: Ignore deleted
            limit: 100,
            // sorted by latest to earliest by default
            // channel: currentChannel,
            basket: "test"
        },
        deserialize: (data) => {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.log("api index error", data);
                channelChangeInProgress = false;
                return {success: false, status: "failed", data: data};
            }
        }
    }).then((result: any) => {
        console.log("m.request result", result);
        channelChangeInProgress = false;
        if (result.success) {
            console.log("channel messages load success");
            // TODO: load message list from result
            // TODO: Should all the messages be replaced or just some?
            currentMessages = [];
            result.allC.map((triple) => {
                var message = triple.c;
                var restoredMessage = {
                    text: message.content,
                    timestamp: message.timestamp,
                    sender: message.sender,
                    status: "stored",
                    sha256: "TODO ????"
                };
                currentMessages.push(restoredMessage);
            });
            currentMessages.sort(function (a, b) {
                return a.timestamp.localeCompare(b.timestamp);
            });
        } else {
            currentMessages = [];
            console.log("channel messages load failed");
        }
        if (callback) callback();
    }, (error) => {
        console.log("api index error", error);
    });
    
    m.redraw();
}

function displayMessageStatus(message) {
    if (message.status === "stored") return [];
    
    var result = [
        m("i", " (" + message.status + ")"),
    ];
    
    if (message.status === "failed") {
        result.push(" ");
        result.push(m("button", {onclick: sendMessage.bind(null, message)}, "Resend"));
    }
    
    return result;
}

function displayChatLog() {
    return m("div", [
        "Chat log:", m("br"),
        currentMessages.map((message) => {
            return m("div.message", [
                sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(m, DOMParser, message.text, {allowLinks: true, allowImages: true}),
                displayMessageStatus(message)
            ]);
        })
    ]);
}

function sendMessageClicked() {
    console.log("sendMessageClicked", currentMessage);
    var newMessage = {
        text: currentMessage,
        timestamp: new Date().toISOString(),
        sender: currentUser,
        status: "prepared",
        sha256: null
    };
    currentMessages.push(newMessage);
    currentMessage = "";
    (<any>document.getElementById("chatEntryTextArea")).value = currentMessage;
    
    sendMessage(newMessage);
}

function pointerForCurrentChannel() {
    return {
        _type: "ChatChannel",
        channelName: currentChannel
    };
}

function sendMessage(message) {
    message.status = "pending";
    
    m.request({
        method: "POST", 
        url: "/api/pointrel20151212/store", 
        data: {
            action: "store",
            content: {
                _type: "Triple",
                timestamp: message.timestamp,
                sender: currentUser,
                a: pointerForCurrentChannel(),
                b: "containsMessage",
                c: {
                    _type: "ChatMessage",
                    timestamp: message.timestamp,
                    sender: message.sender,
                    channelName: currentChannel,
                    content: message.text
                }
            },
            basket: "test"
        }
    }).then((result: any) => {
        console.log("m.request result", result);
        if (result.success) {
            message.status = "stored";
            message.sha256 = result.sha256;
        } else {
            message.status = "failed";
        }
    });
    
    m.redraw();
}

function currentMessageChanged(message) {
    currentMessage = message;
}

function inputKeyPress(callback, event) {
    var keycode = event.keycode || event.which || 0;
    // console.log("inputKeyPress", keycode);
    if (keycode === 13) {
        event.preventDefault();
        return callback();
    }
    // Do not redraw for a character press as stored text will be out of sync with input field
    m.redraw.strategy("none");
}
    
function displayChatEntry() {
    return m("div",
    [
        "Compose:", m("br"),
        m("textarea", {
            id: "chatEntryTextArea",
            // value: currentMessage,
            onchange: m.withAttr("value", currentMessageChanged), 
            // onkeyup: inputKeyPress.bind(null, sendMessageClicked),
            disabled: !!channelChangeInProgress,
            size: "80"
        }),m("br"),
        m("button", {onclick: sendMessageClicked, disabled: !!channelChangeInProgress}, "Send")
    ]
    );
}

export function display() {
    return m("div.chatTextPlugin", [
        m("hr"),
        m("strong", "Chat Text plugin"), m("br"),
        m("input[type=checkbox]", {onclick: m.withAttr("checked", setPoll), checked: polling}),
        "Poll for new messages every five seconds", m("br"),
        displayChatChannel(),
        channelChangeInProgress ? "Channel change in progress..." : "",
        displayChatLog(),
        displayChatEntry()
    ]);
}