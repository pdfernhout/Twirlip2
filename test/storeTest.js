var expect = require("chai").expect;
var request = require("request");

describe("Twirlip storage test", function() {

	describe("store test", function() {

		var url = "http://localhost:9000/api/store";
		var sha256Expected = "559abfcbfa056c176d09dc89a8bfce3004ae168b020e934d50e419e4fcd98535";
			
		it.only("stores some data", function(done) {
			request.post({
				url: url,
				form: {
				    type: "store",
				    content: "Hello, storage!",
				    basket: "test"
				}
			}, function(error, httpResponse, body) {
				console.log("body", body);
				expect(httpResponse.statusCode).to.equal(200);
				body = JSON.parse(body);
				expect(body.success).to.equal(true);
				expect(body.status).to.equal("OK");
				expect(body.sha256).to.equal(sha256Expected);
				done();
			});
		});
	});
});