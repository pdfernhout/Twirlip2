console.log("Hello world test is being called");

import expect = require('intern/chai!expect');
import bdd =  require('intern!bdd');
const describe = bdd.describe;
const it = bdd.it;

describe("Hello mocha test suite", function() {
    it("check addition", function() {
        var result = 10;
        expect(2 + 2).to.equal(4);
    });

    it("check strlen", function() {
        expect("hello".length).to.equal(5);
    });
});
