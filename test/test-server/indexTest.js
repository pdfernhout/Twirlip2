var expect = require("chai").expect;
var request = require("request");

describe("Twirlip storage test", function() {

    describe("store test", function() {

        var storeURL = "http://localhost:9000/api/pointrel20151212/store";

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

        it("stores some data", function(done) {
            request.post({
                url: storeURL,
                form: {
                    action: "store",
                    content: testObject1,
                    basket: "test"
                }
            }, function(error, httpResponse, body) {
                console.log("body", body);
                expect(httpResponse.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.success).to.equal(true);
                expect(body.status).to.equal("OK");
                expect(body.sha256).to.equal(sha256OfTestObject1);
                done();
            });
        });

        it("retrieves some indexed data", function(done) {
            request.post({
                url: storeURL,
                form: {
                    action: "index/latestC",
                    a: testObject1.a,
                    b: testObject1.b,
                    basket: "test"
                }
            }, function(error, httpResponse, body) {
                console.log("body", body);
                expect(httpResponse.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.success).to.equal(true);
                expect(body.status).to.equal("OK");
                expect(body.c).to.deep.equal(testObject1.c);
                done();
            });
        });

        it("retrieves a bunch of indexed data", function(done) {
            request.post({
                url: storeURL,
                form: {
                    action: "index/allC",
                    a: testObject1.a,
                    b: testObject1.b,
                    basket: "test"
                }
            }, function(error, httpResponse, body) {
                console.log("body", body);
                expect(httpResponse.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.success).to.equal(true);
                expect(body.status).to.equal("OK");
                expect(body.allC.length).to.be.greaterThan(0);
                done();
            });
        });
    });
});