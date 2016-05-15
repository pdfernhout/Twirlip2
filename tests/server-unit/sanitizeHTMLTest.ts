import expect = require('intern/chai!expect');
import bdd =  require('intern!bdd');
const describe = bdd.describe;
const it = bdd.it;

require("amd-loader");
import sanitizeHTML = require("../../source/webapp/ts/sanitizeHTML");
import mithril = require("mithril");
import { DOMParser } from 'xmldom';

describe("sanitizeHTML strict test", function() {

    it("processes a div", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, "<div>hello</div>");
        expect(result).to.deep.equal([ { tag: 'div', attrs: {}, children: [ 'hello' ] } ]);
    });
    
    it("uses span for an image", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, '<img src="trouble"></img>');
        // console.log("result", JSON.stringify(result));
        expect(result).to.deep.equal([{"tag":"span","attrs":{},"children":[]}]);
    });
 
    it("handles closed image", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, '<img />');
        // console.log("result", JSON.stringify(result));
        expect(result).to.deep.equal([{"tag":"span","attrs":{},"children":[]}]);
    });
    
    it("fails on an image with width and height", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, '<img src="http://www.kurtz-fernhout.com/kfs_cornerpicture.jpg" width="80" height="64"></img>');
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'span', attrs: {}, children: [] } ]);
    });
    
    it("fails on a script tag", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithoutAttributes(mithril, '<script>alert("hello from JavaScript");</script>');
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'span', attrs: {}, children: [ 'alert("hello from JavaScript");' ] } ]);
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
    
    it("processes an image with width and height", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(mithril, DOMParser, '<img src="http://www.kurtz-fernhout.com/kfs_cornerpicture.jpg" width="80" height="64"></img>', {allowImages: true});
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'img', attrs: {"src": "http://www.kurtz-fernhout.com/kfs_cornerpicture.jpg", width: 80, height: 64}, children: [] } ]);
    });
    
    it("fails on an image with width and height without configuration", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(mithril, DOMParser, '<img src="http://www.kurtz-fernhout.com/kfs_cornerpicture.jpg" width="80" height="64"></img>', {});
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'span', attrs: {}, children: [] } ]);
    });
    
    it("fails on a script tag", function() {
        var result = sanitizeHTML.generateSanitizedHTMLForMithrilWithAttributes(mithril, DOMParser, '<script>alert("hello from JavaScript");</script>');
        // console.log("result", JSON.stringify(result, null, 2));
        expect(result).to.deep.equal([ { tag: 'span', attrs: {}, children: [ 'alert("hello from JavaScript");' ] } ]);
    });
});
