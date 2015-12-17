import m = require("mithril");

import testData = require("./rssFeedExampleFromFSF");

export function initialize() {
    console.log("test data:", testData)
    console.log("RSS plugin initialized");
}

export function display() {
    return m("div.rssPlugin", ["RSS feed reader plugin", m("pre", JSON.stringify(testData, null, 2))]);
}