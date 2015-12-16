// Pointrel20151212 store module to store immutable data in memory

var Promise = require('promise');
var crypto = require('crypto');

var maxShardLength = 10000000;

function makeAlwaysSuccessfulPromise(result) {
    var promise = new Promise(function (resolve, reject) {
        // reject("Unfinished");
        resolve(result);
    });
    
    return promise;
}

function makeShardName() {
    return "shard" + Math.random();
}

function StoreMemory(defaultMetadata) {
    this.shards = {};
    this.sha256ToShardAndPosition = {};
    this.defaultMetadata = defaultMetadata || {};
    this.currentShardName = null;
    this.allocateNewShard();
}

StoreMemory.prototype.allocateNewShard = function() {
    this.currentShardName = makeShardName();
    this.shards[this.currentShardName] = "";
};

StoreMemory.prototype.writeToCurrentShard = function(dataString) {
	if (this.shards[this.currentShardName].length > maxShardLength) {
		this.allocateNewShard();
	}
	var start = this.shards[this.currentShardName].length;
	this.shards[this.currentShardName] += dataString + "\n";
	return {shardName: this.currentShardName, start: start, length: dataString.length};
};

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
    if (dataAsString.length > maxShardLength) throw new Exception("data to be stored is too long: " + dataAsString.length);
    var sha256 = crypto.createHash('sha256').update(dataAsString, 'utf8').digest('hex');
    // console.log("calculated sha256 of data to store", sha256);
    
    var location = this.writeToCurrentShard(dataAsString);
    this.sha256ToShardAndPosition[sha256] = location;
    return makeAlwaysSuccessfulPromise(sha256);
};

StoreMemory.prototype.fetch = function(sha256) {
	var location = this.sha256ToShardAndPosition[sha256];
	if (!location) return null;
	// console.log("location", location);
	// console.log("shard", this.shards[location.shardName]);
    var resultString = this.shards[location.shardName].substring(location.start, location.start + location.length);
    // console.log("retrieved resultString", "|" + resultString + "|");
    var result = JSON.parse(resultString);
    // console.log("retrieved result", result);
    return makeAlwaysSuccessfulPromise(result);
};
    
module.exports = StoreMemory;