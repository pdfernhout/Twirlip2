var respond = require("./respond");

// Retrieve the requested stored resource 
// Such resources may contain unsafe data depending on their source


function storeRequest(request, response) {
    var apiRequest = request.body;
    
    var requestType = apiRequest.type;
    
    if (requestType === "store") return storeRequest(apiRequest, response);
    
    if (requestType === "fetch") return fetchRequest(apiRequest, response);
    
    respond.fail(response, "Unsupported store api request: " + requestType);
}

function storeRequest(apiRequest, response) {
    var basket = apiRequest.basket;
    if (respond.failIfUndefined(response, basket, "basket")) return;

}

function fetchRequest(apiRequest, response) {
    var basket = apiRequest.basket;
    if (respond.failIfUndefined(response, basket, "basket")) return;
    
}

module.exports = storeRequest;