// Pointrel20151212 store module to store immutable data in memory

var Promise = require('promise');
var crypto = require('crypto');
var uuid = require('node-uuid');

var maxSkeinLength = 4096000;
// TODO: Use this in storeDataString for less memory allocation: var sharedOutputBuffer = new Buffer(maxSkeinLength);
var itemPrefix = "@@@PCE ";

// 64 is assumed maximum length for now of possible lengths of length strings combined like for PCE@@@ 999999999999999 999999999999999
var maximumLengthOfAreaIncludingPrefixAndLengths = 64;

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
    return "skein-" + uuid4 + ".pces";
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
    this.skeins[this.currentSkeinName] = {buffer: new Buffer(maxSkeinLength), length: 0};
};

// TODO: Support automatically putting big objects in another skein to optimize writing performance by reducing latency for small objects
StoreMemory.prototype.writeToCurrentSkein = function(buffer) {
	if (this.skeins[this.currentSkeinName].length + buffer.length > maxSkeinLength) {
		this.allocateNewSkein();
	}
	var skein = this.skeins[this.currentSkeinName];
	var start = skein.length;
	var writtenCount = buffer.copy(skein.buffer, start, 0);
	if (debugLogging) console.log("writtenCount", writtenCount);
	if (writtenCount !== buffer.length) {
	    throw new Error("skein.write did not provide expected value: " + writtenCount + " expected: " + buffer.length);
	}
	skein.length += writtenCount;
	return {skeinName: this.currentSkeinName, start: start, length: buffer.length};
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

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function stringStartsWith(string, prefix) {
    return string.slice(0, prefix.length) === prefix;
}

StoreMemory.prototype.storeDataString = function(dataAsString, extraMetadata, skipDuplicates) {
    // TODO: Should probably copy metadata
    // TODO: Should add default metadata
    
    // Quick sanity check
    if (dataAsString.length > maxSkeinLength) throw new Error("dataAsString to be stored is too long: " + dataAsString.length);
    
    if (!isString(dataAsString)) {
        console.log("StoreMemory: dataString is not a string", dataAsString);
        throw new Error("dataString is not a string");
    }
    
    var dataBuffer = new Buffer(dataAsString, "utf8");
    var sha256 = crypto.createHash('sha256').update(dataBuffer).digest('hex');
    
    var metadata = JSON.parse(JSON.stringify(this.defaultMetadata));
    for (var key in extraMetadata) {
        if (extraMetadata.hasOwnProperty(key)) {
            metadata[key] = extraMetadata[key];
        }
    }
    
    metadata.sha256 = sha256;
    metadata.length = dataBuffer.length;
    metadata.timestamp = metadata.timestamp || new Date().toISOString();
    
    var metadataAsString = JSON.stringify(metadata);
    var metadataBuffer = new Buffer(metadataAsString, "utf8");
    
    // console.log("metadataAsString", metadataAsString);
    // console.log("metadataBuffer.length", metadataBuffer.length);
    
    // TODO: Think about whether to include SHA256 with length
    var start = itemPrefix + metadataBuffer.length + " " + dataBuffer.length + " ";
    var startBuffer = new Buffer(start, "utf8");
    
    var newLineBuffer = new Buffer("\n", "utf8");
    
    var totalLength = newLineBuffer.length + startBuffer.length + metadataBuffer.length + newLineBuffer.length + dataBuffer.length + newLineBuffer.length;          
        
    if (totalLength > maxSkeinLength) throw new Error("prepared data to be stored is too long: " + dataBuffer.length + " " + metadataBuffer.length);
    
    var outputBuffer = Buffer.concat([newLineBuffer, startBuffer, metadataBuffer, newLineBuffer, dataBuffer, newLineBuffer]);
    
    var location = this.sha256ToSkeinAndPosition[sha256];
    
    if (skipDuplicates && location) {
        if (debugLogging) console.log("store: skipDuplicates and previously stored ", sha256, location, dataAsString.substring(0, 40) + "...");
    } else {
        var newLocation = this.writeToCurrentSkein(outputBuffer);
        if (debugLogging) console.log("store: sha256 and location of data to store", sha256, newLocation, dataAsString.substring(0, 40) + "...");
        
        // Store a position if only one, or an array of them
        if (location === undefined) {
            location = newLocation;
        } else if (Array.isArray(location)) {
            location.push(newLocation);
        } else {
            location = [location, newLocation];
        }
        this.sha256ToSkeinAndPosition[sha256] = location;
    }
    
    if (debugLogging) console.log("storeDataString sha256", sha256);
    return makeAlwaysSuccessfulPromise(sha256);
};

StoreMemory.prototype.storeDataObject = function(data, extraMetadata, skipDuplicates) {
    var dataAsString = JSON.stringify(data, null, 2);
    if (!extraMetadata) extraMetadata = {};
    extraMetadata.format = "application/json";
    return this.storeDataString(dataAsString, extraMetadata, skipDuplicates);
};

StoreMemory.prototype.fetchDataString = function(sha256, options) {
    // console.log("locations", JSON.stringify(this.sha256ToSkeinAndPosition, null, 2));
    // console.log("fetchDataString", sha256);
	var location = this.sha256ToSkeinAndPosition[sha256];
	
	if (!location) return makeAlwaysSuccessfulPromise(null);
	
	// If more than one, use the last one added or loaded
	if (Array.isArray(location)) location = location[location.length - 1];
	
	// console.log("location", location);
	
	var skein = this.skeins[location.skeinName];
	// console.log("skein", skein);
	
	var buffer = skein.buffer;
	
	// Check start header
	var start = buffer.toString("utf8", location.start, location.start + maximumLengthOfAreaIncludingPrefixAndLengths);
	
	if (!stringStartsWith(start, "\n")) throw new Error("stored item does not start with newline: " + JSON.stringify(location));
	
    if (!stringStartsWith(start, "\n" + itemPrefix)) throw new Error("stored item does not start with correct prefix: " + JSON.stringify(location));

    // Read lengths
    
    var lengthString = start.substring(1 + itemPrefix.length);
    
    // console.log("lengthString", lengthString);
    
    var metadataLengthStringLength = lengthString.indexOf(" ");
    if (metadataLengthStringLength === -1) throw new Error("incorrect metadata length definition: " + lengthString);
    var metadataLengthString = lengthString.substring(0, metadataLengthStringLength);
    // console.log("metadataLengthString", metadataLengthString);
    var metadataLength = parseInt(metadataLengthString);
    if (isNaN(metadataLength) || metadataLength < 1) throw new Error("incorrect metadata length definition: " + lengthString);
    // console.log("metadataLength", metadataLength);
    
    lengthString = lengthString.substring(metadataLengthStringLength + 1);
    
    var dataLengthStringLength = lengthString.indexOf(" ");
    if (dataLengthStringLength === -1) throw new Error("incorrect data length definition: " + lengthString);
    var dataLengthString = lengthString.substring(0, dataLengthStringLength);
    // console.log("dataLengthString", dataLengthString);
    var dataLength = parseInt(dataLengthString);
    if (isNaN(dataLength) || dataLength < 1) throw new Error("incorrect data length definition: " + lengthString);
    // console.log("dataLength", dataLength);
    
	// Read metadata
    var metadataStart = location.start + 1 + itemPrefix.length + metadataLengthStringLength + 1 + dataLengthStringLength + 1;
    var metadataString = buffer.toString("utf8", metadataStart, metadataStart + metadataLength);
    // console.log("metadataString: " + metadataString + "|");
    // console.log("metadataString.length", metadataString.length);
    var metadata = JSON.parse(metadataString);
    // console.log("metadata", metadata);
    
	// Read data
    var dataStart = metadataStart + metadataLength + 1;
    var dataString = buffer.toString("utf8", dataStart, dataStart + dataLength);
    // console.log("dataString: " + dataString + "|");
    
	// Confirm last newline
    var newlineAtEndStart = dataStart + dataLength;
    var newlineAtEnd = buffer.toString("utf8", newlineAtEndStart, newlineAtEndStart + 1);
    if (newlineAtEnd !== "\n") throw new Error("unexpected character for final newline: " + newlineAtEnd);
	
    var result = dataString;
    // TODO: Maybe flag name should be contentType and not format?
    if (options.parseJSON && !metadata.format || metadata.format === "application/json") result = JSON.parse(dataString);
    
    if (!options.returnOnlyData) result = {
        metadata: metadata,
        data: result
    };
    
    // console.log("retrieved result", result);
    return makeAlwaysSuccessfulPromise(result);
};

StoreMemory.prototype.fetchDataObject = function(sha256) {
    return this.fetchDataString(sha256, {returnOnlyData: true, parseJSON: true});
};
    
module.exports = StoreMemory;