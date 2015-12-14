console.log("Hello world test is being called");

var expect = require("chai").expect;

describe("Hello mocha test suite", function() {
    it("check addition", function() {
        var result = 10;
        expect(2 + 2).to.equal(4);
    });

    it("check strlen", function() {
        expect("hello".length).to.equal(5);
    });
});