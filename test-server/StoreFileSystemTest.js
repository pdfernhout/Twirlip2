var expect  = require("chai").expect;
var StoreFileSystem = require("../server/pointrel20151212/StoreFileSystem");

var fs = require("fs");

describe("Pointrel20151212 StoreMemory test", function() {

    var store = new StoreFileSystem();
    
    var testString = "test";
    var sha256OfTestString = "4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e";
    
    var testObject = JSON.parse(fs.readFileSync("./test-data/rssFeedExampleFromFSF.json").toString());
    var sha256OfTestObject = "224ccc878e7b11bca48351b84e2f2a451bc2df3e38bc0eb287d9f942ea4b58a9";
    var sha256OfWrappedTestObject = "a144d8b7218940a191f3d9d43c8d3ad0784bd7a8c7ba73fa6be8b1efd6f36e0a";
    
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
    
    it("stores a test object a second time", function() {
        var promise = store.store(testObject);
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfTestObject);
        });
    });
    
    it("stores a wrapped test object", function() {
        var promise = store.store(store.wrap(testObject, {when: "test"}));
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfWrappedTestObject);
        });
    });
    
    it("fetches a test object", function() {
        var promise = store.fetch(sha256OfTestObject);
        // console.log("about to call promise for fetch", promise);
        return promise.then(function (result) {
            // console.log("result of fetch test is", result);
            expect(JSON.stringify(result)).to.equal(JSON.stringify(testObject));
        });
    });
});