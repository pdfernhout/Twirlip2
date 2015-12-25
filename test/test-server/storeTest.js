var expect = require("chai").expect;
var request = require("request");

describe("Twirlip storage test", function() {

	describe("store test", function() {

		var url = "http://localhost:9000/api/store";
	    var testContent = "Hello, storage!";
		var sha256Expected = "559abfcbfa056c176d09dc89a8bfce3004ae168b020e934d50e419e4fcd98535";
	    
		it("stores some data", function(done) {
			request.post({
				url: url,
				form: {
				    action: "store",
				    content: testContent,
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
		
		it("retrieves some data", function(done) {
			request.post({
				url: url,
				form: {
				    action: "fetch",
				    sha256: sha256Expected,
				    basket: "test"
				}
			}, function(error, httpResponse, body) {
				console.log("body", body);
				expect(httpResponse.statusCode).to.equal(200);
				body = JSON.parse(body);
				expect(body.success).to.equal(true);
				expect(body.status).to.equal("OK");
				expect(body.content).to.equal(testContent);
				done();
			});
		});
	});
});