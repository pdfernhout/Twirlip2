"use strict";

import m = require("mithril");

export function initialize() {
    console.log("Chat Text plugin initialized");
}

var messages = [];

function displayChatLog() {
    return m("div", [
        "Chat log:", m("br"),
        messages.map((message) => {
            return m("div.message", [
                message.text,
                message.status === "pending" ? m("i", " (pending)") : ""
            ]);
        })
    ]);
}

function sendMessage() {
    console.log("send message", currentMessage);
    var newMessage = {
        text: currentMessage,
        status: "pending"
    };
    messages.push(newMessage);
    currentMessage = ""
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
        return sendMessage();
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
        m("button", {onclick: sendMessage}, "Send!")
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