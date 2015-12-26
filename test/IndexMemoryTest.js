var expect  = require("chai").expect;
var StoreMemory = require("../server/pointrel20151212/StoreMemory");
var IndexMemory = require("../server/pointrel20151212/IndexMemory");

var fs = require("fs");

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
	
	var store = new StoreMemory();
	var index = new IndexMemory();
	
	it("stores a test object", function() {
	    var promise = store.storeDataObject(testObject1);
	    return promise.then(function (result) {
	        // console.log("sha256 of store test is", result);
	        expect(result).to.equal(sha256OfTestObject1);   
	    });
	});
	
	it("finds a test object from the index", function() {
		// TODO: Need some kind of URI for triple...
	    index.addTriple(testObject1);
	    var promise = index.findLatestC(testObject1.a, testObject1.b);
	    return promise.then(function (result) {
	        // console.log("sha256 of store test is", result);
	        expect(result).to.deep.equal(testObject1.c);   
	    });
	});
	
});
    
