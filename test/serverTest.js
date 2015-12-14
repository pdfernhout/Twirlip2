var expect  = require("chai").expect;
var request = require("request");

describe("Twirlip server test", function() {

  describe("Thunderbirds Are Grow! response", function() {

    var url = "http://localhost:9000";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns correct response", function(done) {
      request(url, function(error, response, body) {
        expect(body).to.equal("ThunderbirdS Are Grow!\n");
        done();
      });
    });

  });

});