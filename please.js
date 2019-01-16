var request = require('request');
var fs = require('fs');
//const imageFolder = './avatars/';

const lookup = { //github uses these codes: 200, 400, 422, 301, 302, 304, 307, 401, 403
    [200]: function(response) {
        console.log('Response Status Code: ', response.statusMessage, response.headers['content-type']);
        console.log('Download starting...'); //Console log on successful initiation of download
        },
    [400]: function(errorCode) {
        console.log('Unknown error! we should handle this better next time... Error: ', errorCode);
        process.exit();
        },
    [401]: function(errorCode) {
        console.log('Your personal access token is invalid, try updating it. Error: ', errorCode);
        process.exit();
        },
    [404]: function(errorCode) { //I also have some that aren't github specific for other errors such as 
        console.log('Error! The repo you are looking for doesn`t exist! Check your spelling. Error: ', errorCode);
        process.exit();
        },
    [500]: function(errorCode) {
        console.log('Unknown error! we should handle this better next time... Error: ', errorCode);
        process.exit();
        },
    prelim: {
            [200]: function() {
                return;
                },
            [400]: function(errorCode) {
                console.log('Unknown error! we should handle this better next time... Error: ', errorCode);
                process.exit();
                },
            [401]: function(errorCode) {
                console.log('Your personal access token is invalid, try updating it. Error: ', errorCode);
                process.exit();
                },
            [404]: function(errorCode) { //I also have some that aren't github specific for other errors such as 
                console.log('Error! The repo you are looking for doesn`t exist! Check your spelling. Error: ', errorCode);
                process.exit();
                },
            [500]: function(errorCode) {
                console.log('Unknown error! we should handle this better next time... Error: ', errorCode);
                process.exit();
                },
        },
    };


var please = {
    getThisStuff: function (options, cb) {
        request(options, function (err, res, body) {
            cb(err, res, body);
        }) //goes to the requested path on Github and invokes a specified callback - VERY GENERAL USE
    },
    handleDownloadResponse: function (response, onSuccess) {
        lookup[response.statusCode](response);
        onSuccess();
    },
    showDownloadComplete: function () {
        console.log('Download complete!');
    },
    handleNoFolder: function (err) {
        if(err.code === 'ENOENT'){
            console.log("No 'avatars' directory! Please create an empty avatars folder");
            process.exit();
        } else {
            console.log(err); //Lets the user know when there is a missing folder
        }
    },
    checkForErrorsAndGo: function (errorCode, data, onSuccess) {
        lookup.prelim[errorCode](errorCode);
        onSuccess(data);
        },
};


module.exports = please, lookup;