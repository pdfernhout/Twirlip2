"use strict";

import m = require("mithril");

export function initialize() {
    console.log("Storage plugin initialized");
}

export function display() {
    return m("div.storagePlugin", [
        m("hr"),
        m("strong", "Storage plugin"), m("br")
    ]);
}