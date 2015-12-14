var expect  = require("chai").expect;
var StoreMemory = require("../server/pointrel20151212/StoreMemory");

describe("Pointrel20151212 StoreMemory test", function() {

    var store = new StoreMemory();
    
    var testString = "test";
    var sha256OfTest = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

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
            expect(result.what).to.equal(testString);
        });
    });
});