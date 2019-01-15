require("dotenv").load();
var request = require('request');
var fs = require('fs');
const imageFolder = './avatars/';

var please = {
    getThisStuff: function (options, cb) {
        request(options, function (err, res, body) {
            cb(err, res, body);
        }) //goes to the requested path on Github and invokes a specified callback - VERY GENERAL USE
    },
    showDownloadResponse: function (response) {
        console.log('Response Status Code: ', response.statusMessage, response.headers['content-type']);
        console.log('Download starting...'); //Console log on successful initiation of download
    },
    showDownloadComplete: function () {
        console.log('Download complete!');
    },
    handleNoFolder: function (err) {
        if(err.code === 'ENOENT'){
            console.log("No 'avatars' directory! Please create an empty avatars folder");
        } else {
            console.log(err); //Lets the user know when there is a missing folder
        }
    },
    checkForErrorsAndGo: function (errorCode, userInfo, cb) {
        if (errorCode === 404) {
            console.log(`Error! The repo you are looking for doesn't exist! Check your spelling. Error: `, errorCode);
        } else if (errorCode > 500) {
            console.log('Uh-oh! Looks like Github is having some troubles... Error: ', errorCode);
        } else if (errorCode === 401) {
            console.log('Your personal access token is invalid, try updating it. Error: ', errorCode);
        } else {
            userInfo.forEach(function(element, i) {
            var uName = userInfo[i]["login"];
            var thisFilePath = `${imageFolder}${uName}.jpg`;
            cb(userInfo[0]["avatar_url"], thisFilePath);
        });
        } //UNDER CONSTRUCTION - I want this to check for error codes from gitHub and if all is well, perform a specified *MODULAR* task. I think I need another callback...
    },
};


module.exports = please;

function checkForErrorsAndGo(errorCode, userInfo, cb) {
    if (errorCode === 404) {
        console.log(`Error! The repo you are looking for doesn't exist! Check your spelling. Error: `, errorCode);
    } else if (errorCode > 500) {
        console.log('Uh-oh! Looks like Github is having some troubles... Error: ', errorCode);
    } else if (errorCode === 401) {
        console.log('Your personal access token is invalid, try updating it. Error: ', errorCode);
    } else {

        userInfo.forEach(function(element, i) {
        var uName = userInfo[i]["login"];
        var thisFilePath = `${imageFolder}${uName}.jpg`;
        cb(userInfo[0]["avatar_url"], thisFilePath);
        
    });
    }
}