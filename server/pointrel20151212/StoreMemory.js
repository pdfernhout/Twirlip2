// Pointrel20151212 store module to store immutable data in memory

var Promise = require('promise');
var crypto = require('crypto');

function makeAlwaysSuccessfulPromise(result) {
    var promise = new Promise(function (resolve, reject) {
        // reject("Unfinished");
        resolve(result);
    });
    
    return promise;
}

function StoreMemory(defaultMetadata) {
    this.storedData = {};
    this.defaultMetadata = defaultMetadata || {};
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

StoreMemory.prototype.wrap = function(what, metadata) {      
    if (!metadata) metadata = {};
    
    var wrapper = {
        who: metadata.who || this.defaultMetadata.who,
        what: what,
        where: metadata.where || this.defaultMetadata.where,
        when: metadata.when || this.defaultMetadata.when || new Date().toISOString(),
        why: metadata.why || this.defaultMetadata.why,
        how: metadata.how || this.defaultMetadata.how
    };
    
    return wrapper;
};

StoreMemory.prototype.store = function(data) {
    var dataAsString = JSON.stringify(data);
    var sha256 = crypto.createHash('sha256').update(dataAsString, 'utf8').digest('hex');
    console.log("calculated sha256 of data to store", sha256);
    
    this.storedData[sha256] = data;
    return makeAlwaysSuccessfulPromise(sha256);
};

StoreMemory.prototype.fetch = function(sha256) {
    var result = this.storedData[sha256];
    console.log("retrieved result", result);
    return makeAlwaysSuccessfulPromise(result);
};
    
module.exports = StoreMemory;