"use strict";

import m = require("mithril");
import sanitizeHTML = require("../../sanitizeHTML");

// import exampleRSS = require("./rssFeedExampleFromFSF");

var sampleFeeds = [
    "http://static.fsf.org/fsforg/rss/news.xml",
    "http://portland.craigslist.org/sof/index.rss",
    "http://rss.cnn.com/rss/cnn_topstories.rss",
    "http://ma.tt/feed",
    "http://edinburghistoricalsociety.org/feed",
    "http://www.drfuhrman.com/rss/whatshappening.feed",
    "http://www.naturalnews.com/rss.xml",
    "http://scienceblogs.com/channel/life-science/feed/",
    "http://www.healthboards.com/boards/blogs/feed.rss",
    "http://www.freerepublic.com/tag/*/feed.rss",
    "http://www.democraticunderground.com/?com=rss&forum=latest",
    "http://gp.org/press/feed/sql2rss.php",
    "https://www.whitehouse.gov/feed/press",
    "http://www.nasa.gov/rss/dyn/breaking_news.rss",
    "https://soylentnews.org/index.rss"
];

var testURL = sampleFeeds[0];

var rssFeedInstance = {items: []};
var fetchResult = { status: "idle" };
var currentURL = "";
var displayMode = "sanitized";
var loadingError = "";
var sourceContent = "";

function apiRequestSend(apiURL, apiRequest, timeout_ms, successCallback, errorCallback) {
    fetchResult = { status: "pending" };
    
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
                if (successCallback) {
                    var response = JSON.parse(httpRequest.responseText);
                    successCallback(response);
                }
            } else {
                // TODO: Might these sometimes be JSON?
                if (errorCallback) errorCallback({ status: httpRequest.status, message: httpRequest.responseText });
            }
        }
    };

    httpRequest.ontimeout = function() {
        errorCallback({ status: 0, message: "Timeout" });
    };
    
    // var isWordPressAJAX = !!window["ajaxurl"];
       
    // var apiURL = this.apiURL;
    var contentType = 'application/json; charset=utf-8';
    var data = JSON.stringify(apiRequest);
    
    //if (isWordPressAJAX) {
    //    apiURL = apiURL + "?action=pointrel20150417";
    //}

    httpRequest.open('POST', apiURL, true);

    httpRequest.setRequestHeader('Content-Type', contentType);
    httpRequest.setRequestHeader("Accept", "application/json");
    httpRequest.timeout = timeout_ms || 10000;

    httpRequest.send(data);
}

function getField(node: Element, fieldName, defaultValue) {
    var nodes = node.getElementsByTagName(fieldName);
    // console.log("nodes", fieldName, nodes);
    if (nodes && nodes.length && nodes[0].childNodes.length) return nodes[0].childNodes[0].nodeValue;
    return defaultValue;
}

function parseRSS(xmlText) {
    var parser = new DOMParser();
    
    // console.log("about to try to parse XML");
    try {
        var xmlDoc = parser.parseFromString(xmlText, "text/xml");
        // console.log("xmlDoc", xmlDoc);
    } catch (error) {
        console.log("error parsing xml", error);
        loadingError = "error parsing xml" + error;
        return { items: [] };
    }
    
    var itemNodes = xmlDoc.getElementsByTagName("item");
    
    var items = [];
    
    for (var i = 0; i < itemNodes.length; i++) {
        var itemNode = itemNodes[i];
        items.push({
            title: getField(itemNode, "title", ""),
            description: getField(itemNode, "description", ""),
            link: getField(itemNode, "link", ""),
            date: getField(itemNode, "date", "")
        });
    }
    
    return {
        items: items
    };
}

export function initialize() {
    // console.log("test data:", testData);

    // console.log("exampleRSS", exampleRSS);
    // testData = parseRSS(exampleRSS.content);
    
    // newURL(testURL);
    
    console.log("RSS plugin initialized");
}

function newURL(url) {
    console.log("newURL", url);
    currentURL = url;
    loadingError = "";
    sourceContent = "";
    rssFeedInstance = {items: []};
    if (displayMode === "unsafe html") displayMode = "images";
    // TODO: m.request({method: "POST", url: "/api/proxy"}).then( ...
    apiRequestSend("/api/proxy", { url: url }, 10000, (result) => {
        fetchResult = { status: "OK" };
        sourceContent = result.content;
        rssFeedInstance = parseRSS(sourceContent);
        // console.log("proxy request success", result);
        m.redraw();
    }, (failed) => {
        console.log("proxy request failed", failed);
        loadingError = "" + failed;
        fetchResult = { status: "failed" };
        m.redraw();
    });
}

function displayModeChange(newMode) {
    console.log("displayModeChange", newMode);
    displayMode = newMode;
}

function displayModeChooser() {
    var result: any = ["source", "text", "sanitized", "images", "unsafe html"].map((mode) => {
        var selected = (displayMode === mode) ? "*" : "";
        return [ m("button", {onclick: displayModeChange.bind(null, mode)}, selected + mode + selected)];
    });
    result.push(m("br"));
    return result;
}

function displayDescription(description) {
    if (displayMode === "sanitized") return sanitizeHTML.generateSanitizedHTMLForMithril(m, DOMParser, description);
    if (displayMode === "images") return sanitizeHTML.generateSanitizedHTMLForMithril(m, DOMParser, description, {allowImages: true});
    if (displayMode === "unsafe html") return m.trust(description);
    if (displayMode !== "text") console.log("unexpected displayMode:", displayMode);
    return description;
}

function displayItem(item) {
    var title = item.title;
    var link = item.link;
    var description = item.description;
    var timestamp = item.date;

    return m("div.item", [
        m("br"),
        m("strong", title),
        " ", timestamp,
        m("br"),
        displayDescription(description),
        " ",
        m("a", { href: link }, "More ..."),
        m("br")
    ]);
}

function displayRSS() {
    return m("div.feed", [
        "URL:",
        m("input", {onchange: m.withAttr("value", newURL), value: currentURL, size: "80"}),
        m("br"),
        JSON.stringify(fetchResult),
        m("br"),
        displayMode === "source" ?
            [sourceContent, m("br")] :
            [
                rssFeedInstance.items.map(displayItem),
                rssFeedInstance.items.length === 0 ? m("div", "No entries found") : []
            ],
        loadingError ? m("div", ["Loading error: ", loadingError]) : []
    ]);
}

var DropDownFeedChooser = {
    controller: function() {
        return this;
    },
    view: function(ctrl) {
        return m('select', { onchange: m.withAttr('value', newURL.bind(null)) }, [
            m('option', { value: "" }, "[Choose an example RSS feed to load]"),
            sampleFeeds.map((url) => {
                return m('option', { value: url }, url)
            })
        ]);
    }
}

function displayFeedChooser() {
    // return sampleFeeds.map((url) => [ m("button", {onclick: newURL.bind(null, url)}, "V"), " ", url, m("br")]);
    return DropDownFeedChooser;
}

export function display() {
    return m("div.rssPlugin", [
        m("hr"),
        m("strong", "RSS feed reader plugin"), m("br"),
        "Example RSS feeds:", m("br"),
        displayFeedChooser(),
        m("br"),
        displayModeChooser(),
        displayRSS()
    ]);
}