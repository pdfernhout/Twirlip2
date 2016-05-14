import { makeAlwaysSuccessfulPromise } from "../respond";

function IndexMemory() {
    // this.stores = [];
    
    this.indexABC = {};
}

// TODO: Index should be able to be coupled after Store has been running by using an iterator
/*
IndexMemory.prototype.trackStore = function(store) {
    // TODO: Check if already tracking the store
    this.stores.push(store);
    
    // Need to synchronize with a backlog of items to index, starting from the most recent
     
    var iterator = store.makeInterator();
    // TODO: Need to make this a background process somehow as it could take a long time
    while (iterator.hasNext()) {
        var sha256 = iterator.next();
        
    }
}
*/

IndexMemory.prototype.processItem = function(metadata, dataAsString) {
    if (metadata.format === "application/json") {
        // TODO: try/catch on parse
        var item = JSON.parse(dataAsString);
        if (item._type === "Triple") {
            this.addTriple(item);
        }
    }
};

//TODO: Note that this approach depends on object keys maintaining their order, which is not guaranteed by the JS standards but most browsers support it
//isObject and copyObjectWithSortedKeys are from Mirko Kiefer (with added semicolons):
//https://raw.githubusercontent.com/mirkokiefer/canonical-json/master/index2.js
function isObject(a) {
	return Object.prototype.toString.call(a) === '[object Object]';
}
function copyObjectWithSortedKeys(object) {
	if (isObject(object)) {
		var newObj = {};
		var keysSorted = Object.keys(object).sort();
		var key;
		for (var i = 0, len = keysSorted.length; i < len; i++) {
			key = keysSorted[i];
			newObj[key] = copyObjectWithSortedKeys(object[key]);
		}
		return newObj;
	} else if (Array.isArray(object)) {
		return object.map(copyObjectWithSortedKeys);
	} else {
		return object;
	}
}
function stringifyUsingCanonicalJSON(object) {
	return JSON.stringify(copyObjectWithSortedKeys(object), null, 2);
}

IndexMemory.prototype.addTriple = function(originalTriple) {
	// TODO: validate it is a triple
	
	// Work with canonical objects for consistent indexing
	var triple = copyObjectWithSortedKeys(originalTriple);
	
	var aKey = JSON.stringify(triple.a);
	var bKey = JSON.stringify(triple.b);
	
    var aIndex = this.indexABC[aKey];
    if (!aIndex) {
        aIndex = {};
        this.indexABC[aKey] = aIndex;
    }
    var bIndex = aIndex[bKey];
    if (!bIndex) {
        bIndex = {};
        aIndex[bKey] = bIndex;
    }
    var versions = bIndex.versions;
    if (!versions) {
        versions = [];
        bIndex.versions = versions;
    }
    versions.push(triple);
    // TODO: Should consider other fields when timestamps are equal to have consistent ordering
    if (!bIndex.latestCTimestamp || compareTriples(bIndex.latestTriple, triple) < 0) {
        bIndex.latestCTimestamp = triple.timestamp;
        bIndex.latestTriple = triple;
    }
    
    // TODO: Optimize not to sort when item added at end is in order
    versions.sort(compareTriples);
};

function compareTriples(t1, t2) {
	if (t1.timestamp < t2.timestamp) return -1;
	if (t1.timestamp > t2.timestamp) return 1;
	
	// TODO: Pass in sha256 and use that instead for conflict resolution for equal timestamps
	// Consider other fields when timestamps are equal to have consistent ordering; this should be rare
	
	var a1 = JSON.stringify(t1.a);
	var a2 = JSON.stringify(t2.a);
		
	if (a1 < a2) return -1;
	if (a1 > a2) return 1;

	var b1 = JSON.stringify(t1.b);
	var b2 = JSON.stringify(t2.b);
		
	if (b1 < b2) return -1;
	if (b1 > b2) return 1;
	
	var c1 = JSON.stringify(t1.c);
	var c2 = JSON.stringify(t2.c);
		
	if (c1 < c2) return -1;
	if (c1 > c2) return 1;
	
	return 0;
}

IndexMemory.prototype.getIndexEntries = function(a, b) {
    if (a === undefined) throw ("a should not be undefined");
    a = copyObjectWithSortedKeys(a);
    var aKey = JSON.stringify(a);
    var aIndex = this.indexABC[aKey];
    if (!aIndex) return null;
    if (b === undefined) return aIndex;
    b = copyObjectWithSortedKeys(b);
    var bKey = JSON.stringify(b);
    var bIndex = aIndex[bKey];
    if (!bIndex) return null;
    return bIndex;
};

IndexMemory.prototype.findLatestC = function(a, b) {
    var indexEntries = this.getIndexEntries(a, b);
    if (!indexEntries || !indexEntries.latestTriple) return makeAlwaysSuccessfulPromise(null);
	return makeAlwaysSuccessfulPromise(indexEntries.latestTriple.c);
};

IndexMemory.prototype.findAllC = function(a, b) {
    var indexEntries = this.getIndexEntries(a, b);
    if (!indexEntries || !indexEntries.latestTriple) return makeAlwaysSuccessfulPromise([]);
    return makeAlwaysSuccessfulPromise(indexEntries.versions || []);
};

export = IndexMemory;
