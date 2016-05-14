// Routines to return standardized responses

import Promise = require('promise');

export function makeAlwaysSuccessfulPromise(result) {
    var promise = new Promise(function (resolve, reject) {
        // reject("Unfinished");
        resolve(result);
    });
    
    return promise;
}

export function success(response, extra) {
    var result = {
        success: true,
        status: "OK",
    };
    
    for (var key in extra) {
        if (extra.hasOwnProperty(key)) {
            result[key] = extra[key];
        }
    }
    
    response.json(result);
    return true;
}

export function fail(response, errorMessage) {
    response.json({
        success : false,
        status: "failed",
        errorMessage : errorMessage
    });
    return true;
}

export function failIfUndefined(response, field, fieldName) {
    if (field !== undefined) return false;
    fail(response, fieldName + " is undefined");
    return true;
}
