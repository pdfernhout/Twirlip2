// Pointrel20151212 store module to store immutable data

var Promise = require('promise');

function store(data) {
    var promise = new Promise(function (resolve, reject) {
        // reject("Unfinished");
        resolve("OK");
    });
    
    return promise;
}

exports.store = store;