import m = require("mithril");

import testData = require("./rssFeedExampleFromFSF");

export function initialize() {
    console.log("test data:", testData)
    console.log("RSS plugin initialized");
}

function displayItem(item) {
    var title = item.title;
    var link = item.link;
    var description = item.desc;
    var timestamp = item.date;

    return m("div.item", [
        m("br")
        m("strong", title),
        m("br")
        description,
        " ",
        m("a", { href: link }, "More ..."),
        m("br"),
    ]);
}

function displayRSS() {
    return m("div.feed", [
        testData.items.map(displayItem);
	]);
}

export function display() {
    return m("div.rssPlugin", [
        m("hr"),
        m("strong", "RSS feed reader plugin"),
        //m("pre", JSON.stringify(testData, null, 2))
        displayRSS()
    ]);
}