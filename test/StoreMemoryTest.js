var expect  = require("chai").expect;
var StoreMemory = require("../server/pointrel20151212/StoreMemory");

describe("Pointrel20151212 StoreMemory test", function() {

    var store = new StoreMemory();
    
    var testString = "test";
    var sha256OfTest = "4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e";

    it("stores a test string", function() {
        var promise = store.store(testString);
        return promise.then(function (result) {
            console.log("sha256 of store test is", result);
            expect(result).to.equal(sha256OfTest);
        });
    });
    
    it("fetches a test string", function() {
        var promise = store.fetch(sha256OfTest);
        console.log("about to call promise for fetch", promise);
        return promise.then(function (result) {
            console.log("result of fetch test is", result);
            expect(result).to.equal(testString);
        });
    });
});