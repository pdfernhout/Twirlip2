var expect = require("chai").expect;

require("amd-loader");
var sanitizeHTML = require("../webapp/js/sanitizeHTML");
var mithril = require("mithril");
var DOMParser = require('xmldom').DOMParser;

describe("sanitizeHTML strict test", function() {

    it("processes a div", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, "<div>hello</div>");
        expect(result).to.deep.equal([ { tag: 'div', attrs: {}, children: [ 'hello' ] } ]);
    });
    
    it("fails on an image", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, '<img src="trouble"></img>');
        console.log("result", JSON.stringify(result));
        expect(result).to.deep.equal([{"tag":"div","attrs":{},"children":["Strict sanitization issue: Error: tag is not alphanumeric: img src=\"trouble\""]}]);
    });
 
});
    
describe("sanitizeHTML with parameters test", function() {

    it("processes a div with args", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(mithril, DOMParser, '<div id="bar">hello</div>');
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'div', attrs: {}, children: [ 'hello' ] } ]);
    });
    
    it("processes a div with disallowed css class", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(mithril, DOMParser, '<div class="barClass">hello</div>');
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'div', attrs: {}, children: [ 'hello' ] } ]);
    });
    
    it("processes a div with allowed css class", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(mithril, DOMParser, '<div class="narrafirma-special-warning">hello</div>');
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'div', attrs: {"class": "narrafirma-special-warning"}, children: [ 'hello' ] } ]);
    });
    
});


