var request = require('request');

// TODO: Retrieve the requested web resource -- very unsafe:
// TODO: user should be authenticated and trusted or requests should be restricted to local ones
function proxyRequest(theRequest, callback) {
	var url = theRequest.url;
	var options = {
		uri : url,
		jar : false,
		proxy : false,
		followRedirect : true,
		timeout : 1000 * 9
	};

	if (url.substring(0, 5) === 'http:' || url.substring(0, 6) === 'https:') {
		request(options, function(error, response, content) {
			if (error || content === null) {
				if (error) {
					callback({
						success : false,
						status : "failed",
						errorMessage : "The request failed for some reason: " + error
					});
				} else {
					callback({
						success : false,
						status : "failed",
						errorMessage : "The resource is not available: " + url
					});
				}
			} else {
				callback({
					success : true,
					status : "OK",
					content: content
				});
			}
		});
	} else {
		callback({
			success : false,
			status : "disallowed",
			errorMessage : "Only http or https protocols are allowed: " + url
		});
	}
}

module.exports = proxyRequest;