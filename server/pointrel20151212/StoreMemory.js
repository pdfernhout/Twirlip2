// Pointrel20151212 store module to store immutable data in memory

var Promise = require('promise');
var crypto = require('crypto');
var uuid = require('node-uuid');

var maxShardLength = 4096000;

var debugLogging = false;

function makeAlwaysSuccessfulPromise(result) {
    var promise = new Promise(function (resolve, reject) {
        // reject("Unfinished");
        resolve(result);
    });
    
    return promise;
}

function makeShardName() {
	var uuid4 = uuid.v4();
    return "shard-" + uuid4 + ".twirlip";
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
    if (debugLogging) console.log("StoreMemory: Making new shard", this.currentShardName);
    this.shards[this.currentShardName] = "";
};

StoreMemory.prototype.writeToCurrentShard = function(dataString) {
	if (this.shards[this.currentShardName].length > maxShardLength) {
		this.allocateNewShard();
	}
	var start = this.shards[this.currentShardName].length + 1;
	this.shards[this.currentShardName] += "\n" + dataString + "\n";
	return {shardName: this.currentShardName, start: start, length: dataString.length};
};

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
    if (dataAsString.length > maxShardLength) throw new Error("data to be stored is too long: " + dataAsString.length);
    var sha256 = crypto.createHash('sha256').update(dataAsString, 'utf8').digest('hex');
    
	var location = this.sha256ToShardAndPosition[sha256];
	if (!location) {
	    location = this.writeToCurrentShard(dataAsString);
	    if (debugLogging) console.log("store: sha256 and location of data to store", sha256, location, dataAsString.substring(0, 40) + "...");
	    this.sha256ToShardAndPosition[sha256] = location;
	} else {
		if (debugLogging) console.log("store: previously stored ", sha256, location, dataAsString.substring(0, 40) + "...");
	}
	
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