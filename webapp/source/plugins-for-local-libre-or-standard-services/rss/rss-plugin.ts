"use strict";

import m = require("mithril");

import exampleRSS = require("./rssFeedExampleFromFSF");

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
    console.log("nodes", fieldName, nodes);
    if (nodes && nodes.length && nodes[0].childNodes.length) return nodes[0].childNodes[0].nodeValue;
    return defaultValue;
}

function parseRSS(xmlText) {
    var parser = new DOMParser();
    
    console.log("about to try to parse XML");
    try {
        var xmlDoc = parser.parseFromString(xmlText, "text/xml");
        console.log("xmlDoc", xmlDoc);
    } catch (error) {
        console.log("error parsing xml", error);
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

    console.log("exampleRSS", exampleRSS);
    // testData = parseRSS(exampleRSS.content);
    
    newURL(testURL);
    
    console.log("RSS plugin initialized");
}

function newURL(url) {
    console.log("newURL", url);
    currentURL = url;
    // TODO: m.request({method: "POST", url: "/api/proxy"}).then( ...
    apiRequestSend("/api/proxy", { url: url }, 10000, (result) => {
        fetchResult = { status: "OK" };
        rssFeedInstance = parseRSS(result.content);
        console.log("proxy request success", result);
        m.redraw();
    }, (failed) => {
        console.log("proxy request failed", failed);
        fetchResult = { status: "failed" };
        m.redraw();
    });
}

function displayItem(item) {
    var title = item.title;
    var link = item.link;
    var description = item.description;
    var timestamp = item.date;

    return m("div.item", [
        m("br"),
        m("strong", title),
        m("br"),
        description,
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
        rssFeedInstance.items.map(displayItem)
    ]);
}

export function display() {
    return m("div.rssPlugin", [
        m("hr"),
        m("strong", "RSS feed reader plugin"), m("br"),
        "Examples:", m("br"),
        sampleFeeds.map((url) => [ m("button", {onclick: newURL.bind(null, url)}, "V"), " ", url, m("br")]),
        m("br"),
        displayRSS()
    ]);
}