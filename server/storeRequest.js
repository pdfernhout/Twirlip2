var respond = require("./respond");
var StoreMemory = require("./pointrel20151212/StoreMemory");

// Retrieve the requested stored resource 
// Such resources may contain unsafe data depending on their source

function storeRequest(request, response) {
    var apiRequest = request.body;
    
    console.log("storeRequest", apiRequest);
    
    var requestedAction = apiRequest.action;
    
    if (respond.failIfUndefined(response, requestedAction, "action")) return;
    
    if (Math.random() < 0.3) return respond.fail(response, "Random failure for testing");
    
    if (requestedAction === "store") return doStoreAction(apiRequest, response);
    
    if (requestedAction === "fetch") return doFetchAction(apiRequest, response);

    if (requestedAction === "basketList") return doBasketListAction(apiRequest, response);

    if (requestedAction === "sha256List") return doSHA256ListAction(apiRequest, response);

    // if (requestType === "addBasket") return doAddBasketAction(apiRequest, response);

    respond.fail(response, "Unsupported store api request: " + requestedAction);
}

var baskets = {};

// TODO: Support storing either string with content type or an object
function doStoreAction(apiRequest, response) {
    var content = apiRequest.content;
    if (respond.failIfUndefined(response, content, "content")) return;
    
    // TODO: Assuming for now content is an object to be converted
    
    var basketName = apiRequest.basket;
    if (respond.failIfUndefined(response, basketName, "basket")) return;

    var basket = baskets[basketName];
    if (!basket) {
        basket = new StoreMemory();
        baskets[basketName] = basket;
    }
    
    basket.storeDataObject(content).then(function (sha256) {
        respond.success(response, {sha256: sha256});
    });
}

// TODO: Support multiple baskets in search
function doFetchAction(apiRequest, response) {
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

//TODO: Support multiple baskets in search
function doBasketListAction(apiRequest, response) {
    var basketNames = Object.keys(baskets);
    respond.success(response, {basketNames: basketNames});
}

module.exports = storeRequest;