// Pointrel20151212 store module to store immutable data in memory

var Promise = require('promise');
var crypto = require('crypto');
var uuid = require('node-uuid');

var maxSkeinLength = 4096000;

var debugLogging = false;

function makeAlwaysSuccessfulPromise(result) {
    var promise = new Promise(function (resolve, reject) {
        // reject("Unfinished");
        resolve(result);
    });
    
    return promise;
}

function makeSkeinName() {
	var uuid4 = uuid.v4();
    return "skein-" + uuid4 + ".twirlip";
}

function StoreMemory(defaultMetadata) {
    this.skeins = {};
    this.sha256ToSkeinAndPosition = {};
    this.defaultMetadata = defaultMetadata || {};
    this.currentSkeinName = null;
    this.allocateNewSkein();
}

StoreMemory.prototype.allocateNewSkein = function() {
    this.currentSkeinName = makeSkeinName();
    if (debugLogging) console.log("StoreMemory: Making new skein", this.currentSkeinName);
    this.skeins[this.currentSkeinName] = "";
};

StoreMemory.prototype.writeToCurrentSkein = function(dataString) {
	if (this.skeins[this.currentSkeinName].length > maxSkeinLength) {
		this.allocateNewSkein();
	}
	var start = this.skeins[this.currentSkeinName].length + 1;
	this.skeins[this.currentSkeinName] += "\n" + dataString + "\n";
	return {skeinName: this.currentSkeinName, start: start, length: dataString.length};
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
    if (dataAsString.length > maxSkeinLength) throw new Error("data to be stored is too long: " + dataAsString.length);
    var sha256 = crypto.createHash('sha256').update(dataAsString, 'utf8').digest('hex');
    
	var location = this.sha256ToSkeinAndPosition[sha256];
	if (!location) {
	    location = this.writeToCurrentSkein(dataAsString);
	    if (debugLogging) console.log("store: sha256 and location of data to store", sha256, location, dataAsString.substring(0, 40) + "...");
	    this.sha256ToSkeinAndPosition[sha256] = location;
	} else {
		if (debugLogging) console.log("store: previously stored ", sha256, location, dataAsString.substring(0, 40) + "...");
	}
	
    return makeAlwaysSuccessfulPromise(sha256);
};

StoreMemory.prototype.fetch = function(sha256) {
	var location = this.sha256ToSkeinAndPosition[sha256];
	if (!location) return null;
	// console.log("location", location);
	// console.log("skein", this.skeins[location.skeinName]);
    var resultString = this.skeins[location.skeinName].substring(location.start, location.start + location.length);
    // console.log("retrieved resultString", "|" + resultString + "|");
    var result = JSON.parse(resultString);
    // console.log("retrieved result", result);
    return makeAlwaysSuccessfulPromise(result);
};
    
module.exports = StoreMemory;