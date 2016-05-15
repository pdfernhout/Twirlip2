import expect = require('intern/chai!expect');
import bdd =  require('intern!bdd');
const describe = bdd.describe;
const it = bdd.it;

import fs = require("fs");

import StoreMemory = require("../../source/server/ts/pointrel20151212/StoreMemory");
import IndexMemory = require("../../source/server/ts/pointrel20151212/IndexMemory");

describe("Pointrel20151212 IndexMemory test", function() {

	var testObject1 = {
		"_type": "Triple",
		"sender": "test@example.com",
		"a": {
			"_type": "ChatChannel",
			"channelName": "test"
		},
		"b": "containsMessage",
		"c": {
			"_type": "ChatMessage",
			"sender": "test@example.com",
			"channelName": "test",
			"content": "test"
		}
	};
	
	var sha256OfTestObject1 = "08cdffa72235eee956662491d59483adba1fdda20888d5fbf69b54fa75e3b1ff";
	
	var index = new IndexMemory();
	// index.trackStore(store);
	
	var store = new StoreMemory({}, index);
	
	it("stores a test object", function() {
	    var promise = store.storeDataObject(testObject1);
	    return promise.then(function (result) {
	        // console.log("sha256 of store test is", result);
	        expect(result).to.equal(sha256OfTestObject1);   
	    });
	});
	
	it("finds a test object from the index", function() {
		// TODO: Need some kind of URI for triple...
	    // index.addTriple(testObject1);
	    var promise = index.findLatestC(testObject1.a, testObject1.b);
	    return promise.then(function (result) {
	        // console.log("sha256 of store test is", result);
	        expect(result).to.deep.equal(testObject1.c);   
	    });
	});
	
});
