"use strict";

import m = require("mithril");

var basketNames = [];
var polling = false;
var pollingTimeout = null;

export function initialize() {
    console.log("System Diagnostics plugin initialized");
}

function setPoll(value) {
    polling = value;
    
    if (!polling && pollingTimeout) {
        clearTimeout(pollingTimeout);
        pollingTimeout = null;
        console.log("stop polling for baskets");
        return;
    }
    
    if (!pollingTimeout) {
        pollingTimeout = setTimeout(poll, 5000);
        console.log("start polling for baskets");
    }
}

function poll() {
    console.log("polling");
    pollingTimeout = setTimeout(poll, 5000);
}

export function display() {
    return m("div.systemDiagnosticsPlugin", [
        m("hr"),
        m("strong", "System Diagnostics feed plugin"), m("br"),
        m("input[type=checkbox]", {onclick: m.withAttr("checked", setPoll), checked: polling}),
        "Poll for baskets", m("br"),
        "Baskets: ", m("br"),
        basketNames.map((basketName) => {
            return m("div", basketName);
        })
    ]);
}