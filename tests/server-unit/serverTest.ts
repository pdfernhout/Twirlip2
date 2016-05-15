import expect = require('intern/chai!expect');
import bdd =  require('intern!bdd');
const describe = bdd.describe;
const it = bdd.it;

import fs = require("fs");

import request = require("request");

describe("Twirlip server test", function() {

  describe("Thunderbirds Are Grow! response", function() {

    var url = "http://localhost:9000";

    it("returns status 200", function() {
      const done = this.async();
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done.resolve();
      });
    });

    it("returns correct response", function() {
      const done = this.async();
      request(url, function(error, response, body) {
        expect(body).to.equal("ThunderbirdS Are Grow!\n");
        done.resolve();
      });
    });

  });

});
