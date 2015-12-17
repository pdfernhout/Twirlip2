import m = require("mithril");

export function initialize() {
    console.log("RSS plugin initialized");
}

export function display() {
    return m("div.rssPlugin", ["RSS feed reader plugin"]);
}