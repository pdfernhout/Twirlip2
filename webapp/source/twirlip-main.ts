"use strict";

import m = require("mithril");

// Temp for now -- need to generalize plugin loading
import rssPlugin = require("./plugins-for-local-libre-or-standard-services/rss/rss-plugin");
rssPlugin.initialize();

// Test: http://localhost:9000/twirlip.html

function createLayout() {
    console.log("createLayout");

    var mainDiv = document.getElementById("mainDiv");
    m.render(mainDiv, m("div", [
        "Hello world from Twirlip",
        m("hr"),
        "ThunderbirdS Are Grow!",
        " "
        m("a", { href: "http://pdfernhout.net/thunderbirds-are-grow-manifesto.html" }, "manifesto!"),
        " ",
        m("a", { href: "http://www.yorkmaze.com/thunderbirds-are-grow/" }, "coincidence?"),
        rssPlugin.display()
    ]));
    
    // turn off initial "please wait" display
    hidePleaseWait();
}

// getHashParameters derived from: http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
function getHashParameters() {
    var hash = window.location.hash.substr(1);
    var result = {};
    var match;
    // Regex for replacing addition symbol with a space
    var plusMatcher = /\+/g;
    var parameterSplitter = /([^&;=]+)=?([^&;]*)/g;
    var decode = function(s) { return decodeURIComponent(s.replace(plusMatcher, " ")); };
    while (true) {
        match = parameterSplitter.exec(hash);
        if (!match) break;
        result[decode(match[1])] = decode(match[2]);
    }
    return result;
}

function hidePleaseWait() {
    // This uses a window.narraFirma_pleaseWaitTimeout global set in survey.html
    console.log("turned off please wait at", new Date(), "still waiting to display", !!window["twirlip_pleaseWaitTimeout"]);
    if (window["twirlip_pleaseWaitTimeout"]) {
        clearTimeout(window["twirlip_pleaseWaitTimeout"]);
        window["twirlip_pleaseWaitTimeout"] = null;
    }
    document.getElementById("pleaseWaitDiv").style.display = "none";
}

function initialize() {
    var configuration = getHashParameters();
    console.log("configuration", configuration);

    createLayout();
}

initialize();
