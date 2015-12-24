"use strict";

import m = require("mithril");

export function initialize() {
    console.log("System Diagnostics plugin initialized");
}

export function display() {
    return m("div.systemDiagnosticsPlugin", [
        m("hr"),
        m("strong", "System Diagnostics feed plugin"), m("br")
    ]);
}