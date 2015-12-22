var respond = require("./respond");
var StoreMemory = require("./pointrel20151212/StoreMemory");

// Retrieve the requested stored resource 
// Such resources may contain unsafe data depending on their source

function storeRequest(request, response) {
    var apiRequest = request.body;
    
    var requestType = apiRequest.type;
    
    if (requestType === "store") return storeRequest(apiRequest, response);
    
    if (requestType === "fetch") return fetchRequest(apiRequest, response);
    
    respond.fail(response, "Unsupported store api request: " + requestType);
}

var baskets = {};

// TODO: Support storing either string with content type or an object
function storeRequest(apiRequest, response) {
    var content = apiRequest.content;
    if (respond.failIfUndefined(response, content, "content")) return;
    
    // TODO: Assuming for now content is an object to be converted
    
    var basketName = apiRequest.basket;
    if (respond.failIfUndefined(response, basketName, "basket")) return;

    var basket = baskets[basketName];
    if (!basket) {
        basket = new StoreMemory();
        baskets[basketName] = baskets;
    }
    
    basket.storeDataObject(content).then(function (sha256) {
        respond.success(response, {sha256: sha256});
    });
}

// TODO: Support multiple baskets in search
function fetchRequest(apiRequest, response) {
    var sha256 = apiRequest.sha256;
    if (respond.failIfUndefined(response, sha256, "sha256")) return;
    
    var basketName = apiRequest.basket;
    if (respond.failIfUndefined(response, basketName, "basket")) return;
    
    var basket = baskets[basketName];
    if (!basket) return respond.fail(response, "No such basket: " + basketName);
    
    basket.fetchDataObject(sha256).then(function (result) {
        respond.success(response, {content: result});
    });
}

module.exports = storeRequest;