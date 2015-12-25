"use strict";

import m = require("mithril");

export function initialize() {
    console.log("Chat Text plugin initialized");
}

var messages = [];

function displayMessageStatus(message) {
    if (message.status === "stored") return [];
    
    var result = [
        m("i", " (" + message.status + ")"),
    ];
    
    if (message.status === "failed") {
        result.push(" ");
        result.push(m("button", {onclick: sendMessage.bind(null, message)}, "Resend!"));
    }
    
    return result;
}

function displayChatLog() {
    return m("div", [
        "Chat log:", m("br"),
        messages.map((message) => {
            return m("div.message", [
                message.text,
                displayMessageStatus(message)
            ]);
        })
    ]);
}

function sendMessageClicked() {
    console.log("sendMessageClicked", currentMessage);
    var newMessage = {
        text: currentMessage,
        status: "prepared",
        sha256: null
    };
    messages.push(newMessage);
    currentMessage = ""
    
    sendMessage(newMessage);
}

function sendMessage(message) {
    message.status = "pending";
    
    m.request({
        method: "POST", 
        url: "/api/store", 
        data: {
            action: "store",
            content: message.text,
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

var currentMessage = "";

function inputKeyPress(event) {
    var keycode = event.keycode || event.which || 0;
    // console.log("inputKeyPress", keycode);
    if (keycode === 13) {
        event.preventDefault();
        return sendMessageClicked();
    }
    // Do not redraw for a character press as currentMessage will be out of sync with input field
    m.redraw.strategy("none");
}
    
function displayChatEntry() {
    return m("div", [
        "Message:",
        m("input", {
            value: currentMessage,
            onchange: m.withAttr("value", currentMessageChanged), 
            onkeyup: inputKeyPress,
            size: "80"
        }),
        m("button", {onclick: sendMessageClicked}, "Send!")
    ]
    );
}

export function display() {
    return m("div.chatTextPlugin", [
        m("hr"),
        m("strong", "Chat Text plugin"), m("br"),
        displayChatLog(),
        displayChatEntry()
    ]);
}