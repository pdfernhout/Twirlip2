var expect  = require("chai").expect;
var StoreMemory = require("../server/pointrel20151212/StoreMemory");

var fs = require("fs");

describe("Pointrel20151212 StoreMemory test", function() {

    var store = new StoreMemory();
    
    var testString = "test";
    var sha256OfTestString = "4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e";
    
    var testObject = JSON.parse(fs.readFileSync("./test-data/rssFeedExampleFromFSF.json").toString());
    var sha256OfTestObject = "224ccc878e7b11bca48351b84e2f2a451bc2df3e38bc0eb287d9f942ea4b58a9";

    it("stores a test string", function() {
        var promise = store.store(testString);
        return promise.then(function (result) {
            // console.log("sha256 of store test is", result);
            expect(result).to.equal(sha256OfTestString);
        });
    });
    
    it("fetches a test string", function() {
        var promise = store.fetch(sha256OfTestString);
        // console.log("about to call promise for fetch", promise);
        return promise.then(function (result) {
            // console.log("result of fetch test is", result);
            expect(result).to.equal(testString);
        });
    });
    
    it("stores a test object", function() {
        var promise = store.store(testObject);
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfTestObject);
        });
    });
    
    it("fetches a test object", function() {
        var promise = store.fetch(sha256OfTestObject);
        // console.log("about to call promise for fetch", promise);
        return promise.then(function (result) {
            // console.log("result of fetch test is", result);
            expect(result).to.equal(testObject);
        });
    });
});