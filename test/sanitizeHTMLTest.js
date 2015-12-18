var expect = require("chai").expect;

require("amd-loader");
var sanitizeHTML = require("../webapp/js/sanitizeHTML");
var mithril = require("mithril");

describe("sanitizeHTML test", function() {

    it.only("processes a div", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithril(mithril, "<div>hello</div>");
    });
    
    it("processes a div with args", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithril(mithril, '<div foo="bar">hello</div>"');
        console.log("result", JSON.stringify(result, null, 2));
    });
    
});


