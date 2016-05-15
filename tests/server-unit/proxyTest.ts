import expect = require('intern/chai!expect');
import bdd =  require('intern!bdd');
const describe = bdd.describe;
const it = bdd.it;

import request = require("request");

describe("Twirlip server test", function() {

	describe("proxy response", function() {

		var url = "http://localhost:9000/api/proxy";

		it("returns RSS feed", function() {
			const done = this.async();
			request.post({
				url: url,
				form: {
				    url: "http://static.fsf.org/fsforg/rss/news.xml"
				}
			}, function(error, httpResponse, body) {
				console.log("body", body);
				expect(httpResponse.statusCode).to.equal(200);
				body = JSON.parse(body);
				expect(body.success).to.equal(true);
				expect(body.status).to.equal("OK");
				expect(body.content).to.match(/^<\?xml/);
				done.resolve();
			});
		});
	});
});
