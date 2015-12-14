var expect  = require("chai").expect;
var pointrel20151212 = require("../server/pointrel20151212/store");

describe("Pointrel20151212 storage test", function() {

  describe("Saving data", function() {

    it("returns success", function(done) {
        var promise = pointrel20151212.store("test");
        promise.then(done.bind(null, null), done);
    });

  });

});