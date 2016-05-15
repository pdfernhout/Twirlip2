import expect = require('intern/chai!expect');
import bdd =  require('intern!bdd');
const describe = bdd.describe;
const it = bdd.it;

import fs = require("fs");

import StoreMemory = require("../../source/server/ts/pointrel20151212/StoreMemory");

describe("Pointrel20151212 StoreMemory test", function() {

    var store = new StoreMemory();
    
    var testString = "test";
    var sha256OfTestString = "4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e";
    
    var testObject = JSON.parse(fs.readFileSync("./test-data/rssFeedExampleFromFSF.json").toString());
    var sha256OfTestObject = "608d82ba5d26179308af03671871bd8dc48f00c69f5489b0e162456e1be53b39";
    var sha256OfWrappedTestObject = "74c03021a8561e4f0eae1a1457a057b1f9df97ed8816fb1807a606a3e2ac5ab1";
    
    it("stores a test string", function() {
        var promise = store.storeDataObject(testString);
        return promise.then(function (result) {
            // console.log("sha256 of store test is", result);
            expect(result).to.equal(sha256OfTestString);
        });
    });
    
    it("fetches a test string", function() {
        var promise = store.fetchDataObject(sha256OfTestString);
        // console.log("about to call promise for fetch", promise);
        return promise.then(function (result) {
            // console.log("result of fetch test is", result);
            expect(result).to.equal(testString);
        });
    });
    
    it("stores a test object", function() {
        var promise = store.storeDataObject(testObject);
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfTestObject);
        });
    });
    
    it("stores a test object a second time", function() {
        var promise = store.storeDataObject(testObject);
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfTestObject);
        });
    });
    
    it("stores a test object a third time with skipDuplicates", function() {
        var promise = store.storeDataObject(testObject, {}, {skipDuplicates: true});
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfTestObject);
        });
    });
    
    it("stores a wrapped test object", function() {
        var promise = store.storeDataObject(store.wrap(testObject, {when: "test"}));
        return promise.then(function (result) {
            // console.log("sha256 of store object is", result);
            expect(result).to.equal(sha256OfWrappedTestObject);
        });
    });
    
    it("fetches a test object", function() {
        var promise = store.fetchDataObject(sha256OfTestObject);
        // console.log("about to call promise for fetch", promise);
        return promise.then(function (result) {
            // console.log("result of fetch test is", result);
            expect(JSON.stringify(result)).to.equal(JSON.stringify(testObject));
        });
    });
});
