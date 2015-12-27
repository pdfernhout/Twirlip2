"use strict";

import m = require("mithril");

var basketNames = [];
var currentBasketName = "";
var polling = false;
var pollingTimeout = null;
var sha256List = [];
var currentContent = "";

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
    pollingTimeout = null;
    
    // Do not poll if the document is not visible
    if (document.hidden === true) {
        // console.log("poll: not polling because not visible");
        pollingTimeout = setTimeout(poll, 5000);
        return;
    }
    
    updateBasketList(() => {
        pollingTimeout = setTimeout(poll, 5000);
    });
}

function updateBasketList(callback) {
    console.log("updateBasketList");
    
    sha256List = [];
    currentBasketName = "";
    currentContent = "";

    m.request({
        method: "POST", 
        url: "/api/pointrel20151212/store", 
        data: {
            action: "basketList",
        }
    }).then((result: any) => {
        console.log("m.request basket list result", result);
        if (result.success) {
            basketNames = result.basketNames;
        } else {
            console.log("polling for basket list failed");
        }
        if (callback) callback();
    });
    
    m.redraw();
}

function updateSHA256List(basketName, callback) {
    console.log("updateSHA256List");
    sha256List = [];
    currentBasketName = basketName;
    currentContent = "";
    
    m.request({
        method: "POST", 
        url: "/api/pointrel20151212/store", 
        data: {
            action: "sha256List",
            basket: basketName
        }
    }).then((result: any) => {
        console.log("m.request sha256 list result", result);
        if (result.success) {
            sha256List = result.sha256List;
        } else {
            console.log("polling for sha256 list failed");
        }
        if (callback) callback();
    });
    
    m.redraw();
}

function updateContentsForSHA256(sha256, callback) {
    currentContent = "";
    
    m.request({
        method: "POST", 
        url: "/api/pointrel20151212/store", 
        data: {
            action: "fetch",
            basket: currentBasketName,
            sha256: sha256
        }
    }).then((result: any) => {
        console.log("m.request sha256 contents result", result);
        if (result.success) {
            currentContent = result.content;
        } else {
            console.log("polling for sha256 list failed");
        }
        if (callback) callback();
    });
    
    m.redraw();
}

export function display() {
    return m("div.systemDiagnosticsPlugin", [
        m("hr"),
        m("strong", "System Diagnostics feed plugin"), m("br"),
        m("input[type=checkbox]", {onclick: m.withAttr("checked", setPoll), checked: polling}),
        "Poll for baskets", m("br"),
        m("button", {onclick: updateBasketList.bind(null, null)}, "Update basket list"), m("br"),
        "Baskets: ", m("br"),
        basketNames.map((basketName) => {
            return m("div", m("button", {onclick: updateSHA256List.bind(null, basketName, null)}, basketName));
        }),
        "sha256 in basket: ", currentBasketName, m("br"),
        sha256List.map((sha256) => {
            return m("div", m("button", {onclick: updateContentsForSHA256.bind(null, sha256, null)}, sha256));

        }),
        "Current contents:", m("br"),
        m("pre", JSON.stringify(currentContent, null, 2))
    ]);
}