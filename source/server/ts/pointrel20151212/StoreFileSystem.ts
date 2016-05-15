// Pointrel20151212 store module to store immutable data in memory

// TODO: Remove duplication with StoreMemory

import fs = require("fs");

import crypto = require('crypto');
import uuid = require('node-uuid');

import { makeAlwaysSuccessfulPromise } from "../respond";

var maxShardLength = 4096000;

var debugLogging = false;

function makeShardName() {
	var uuid4 = uuid.v4();
    return "shard-" + uuid4 + ".twirlip";
}

function StoreFileSystem(storageDirectory?, defaultMetadata?) {
    this.storageDirectory = storageDirectory;
    this.shards = {};
    this.sha256ToShardAndPosition = {};
    this.defaultMetadata = defaultMetadata || {};
    this.currentShardName = null;
    this.allocateNewShard();
}

StoreFileSystem.prototype.allocateNewShard = function() {
    this.currentShardName = makeShardName();
    if (debugLogging) console.log("StoreFileSystem: Making new shard", this.currentShardName);
    this.shards[this.currentShardName] = 0;
};

StoreFileSystem.prototype.writeToCurrentShard = function(dataString) {
	if (this.shards[this.currentShardName].length > maxShardLength) {
		this.allocateNewShard();
	}
	
	var start = this.shards[this.currentShardName].length;
	
	this.shards[this.currentShardName] += "\n" + dataString + "\n";
	
	return {shardName: this.currentShardName, start: start, length: dataString.length};
};

StoreFileSystem.prototype.wrap = function(what, metadata) {      
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

StoreFileSystem.prototype.store = function(data) {
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

StoreFileSystem.prototype.fetch = function(sha256) {
	var location = this.sha256ToShardAndPosition[sha256];
	if (!location) return null;
	console.log("location", location);
	console.log("shard", this.shards[location.shardName]);
	
    var resultString = this.shards[location.shardName].substring(location.start, location.start + location.length);
    // console.log("retrieved resultString", "|" + resultString + "|");
    var result = JSON.parse(resultString);
    // console.log("retrieved result", result);
    return makeAlwaysSuccessfulPromise(result);
};

export = StoreFileSystem;
