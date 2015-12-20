var requestAPI = require('request');

// TODO: Retrieve the requested web resource -- very unsafe:
// TODO: user should be authenticated and trusted or requests should be restricted to local ones
function proxyRequest(request, response) {
	var url = request.body.url;
	var options = {
		uri : url,
		jar : false,
		proxy : false,
		followRedirect : true,
		timeout : 1000 * 9
	};
	
	var callback = function (requestResultMessage) {
        response.json(requestResultMessage);
    };

	if (url.substring(0, 5) === 'http:' || url.substring(0, 6) === 'https:') {
		requestAPI(options, function(error, response, content) {
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