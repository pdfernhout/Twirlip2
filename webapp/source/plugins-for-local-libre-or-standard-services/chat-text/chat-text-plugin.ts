"use strict";

import m = require("mithril");

export function initialize() {
    console.log("Chat Text plugin initialized");
}

function displayChatLog() {
    return m("div", "Chat log goes here");
}

function displayChatEntry() {
    return m("div", "Chat entry goes here");
}

export function display() {
    return m("div.chatTextPlugin", [
        m("hr"),
        m("strong", "Chat Text plugin"), m("br"),
        displayChatLog(),
        displayChatEntry()
    ]);
}