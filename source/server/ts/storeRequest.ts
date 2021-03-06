import respond = require("./respond");
import StoreMemory = require("./pointrel20151212/StoreMemory");
import IndexMemory = require("./pointrel20151212/IndexMemory");

// Retrieve the requested stored resource 
// Such resources may contain unsafe data depending on their source
 function storeRequest(request, response): any {
    var apiRequest = request.body;
    
    console.log("storeRequest", apiRequest);
    
    var requestedAction = apiRequest.action;
    
    if (respond.failIfUndefined(response, requestedAction, "action")) return;
    
    // if (Math.random() < 0.3) return respond.fail(response, "Random failure for testing");
    
    if (requestedAction === "store") return doStoreAction(apiRequest, response);
    
    if (requestedAction === "fetch") return doFetchAction(apiRequest, response);

    if (requestedAction === "basketList") return doBasketListAction(apiRequest, response);

    if (requestedAction === "sha256List") return doSHA256ListAction(apiRequest, response);
    
    if (requestedAction === "index/latestC") return doIndexLastestC(apiRequest, response);
    
    if (requestedAction === "index/allC") return doIndexAllC(apiRequest, response);

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
        var index = new IndexMemory();
        basket = new StoreMemory({}, index);
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

function doBasketListAction(apiRequest, response) {
    var basketNames = Object.keys(baskets);
    respond.success(response, {basketNames: basketNames});
}

function doSHA256ListAction(apiRequest, response) {
    var basketName = apiRequest.basket;
    if (respond.failIfUndefined(response, basketName, "basket")) return;
    
    var basket = baskets[basketName];
    if (!basket) return respond.fail(response, "No such basket: " + basketName);
    
    respond.success(response, {sha256List: Object.keys(basket.sha256ToSkeinAndPosition)});
    
}

// TODO: Support multiple baskets in search
function doIndexLastestC(apiRequest, response) {
    var a = apiRequest.a;
    if (respond.failIfUndefined(response, a, "a")) return;
    
    var b = apiRequest.b;
    if (respond.failIfUndefined(response, b, "b")) return;
    
    var basketName = apiRequest.basket;
    if (respond.failIfUndefined(response, basketName, "basket")) return;
    
    var basket = baskets[basketName];
    if (!basket) return respond.fail(response, "No such basket: " + basketName);
    
    basket.index.findLatestC(a, b).then(function (result) {
        respond.success(response, {c: result});
    });
}

// TODO: Support multiple baskets in search
// TODO: Support limit and continuatio
function doIndexAllC(apiRequest, response) {
    var a = apiRequest.a;
    if (respond.failIfUndefined(response, a, "a")) return;
    
    var b = apiRequest.b;
    if (respond.failIfUndefined(response, b, "b")) return;
    
    var basketName = apiRequest.basket;
    if (respond.failIfUndefined(response, basketName, "basket")) return;
    
    var basket = baskets[basketName];
    if (!basket) return respond.fail(response, "No such basket: " + basketName);
    
    // TODO: Automatically remove all deleted items unless a flag says to keep them
    basket.index.findAllC(a, b).then(function (result) {
        respond.success(response, {allC: result});
    });
}

export = storeRequest;