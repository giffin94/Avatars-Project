if (require("dotenv").load().error){
    console.log("No .env file!");
    process.exit();
}; //looking at the code for dotenv, we found that as long as there is no error when requiring file, require("dotenv").load().error returns falsy

var request = require('request');
var fs = require('fs');
var gitInfo = process.argv.slice(2);
var userName = gitInfo[0];
var repo = gitInfo[1];
var please = require('../please.js');
const imageFolder = './avatars/';

function getRepoContributors (repoOwner, repoName, cb) {
   //gets repo contributors using a username and a repo name to create a path
    var endPath = '/contributors';
    var options = {
        url: `https://api.github.com/repos/${repoOwner}/${repoName}${endPath}`,
        qs: {
            access_token: process.env.GITHUB_TOKEN
        },
        headers: {
            'user-agent': 'giffin94'
        }
    };
    please.getThisStuff(options, cb);
}


function downloadImageByURL(url, filePath) {
    request(url)
        .on('response', function (response) {
            please.handleDownloadResponse(response, function () {
                response.pipe(fs.createWriteStream(filePath).on('error', please.handleNoFolder));
                });
        })
        .on('end', please.showDownloadComplete);
}

if (process.env.GITHUB_TOKEN) {

    if (gitInfo.length < 2) {
        console.log(`Please include a user and a repo!`);
    } else if (gitInfo.length > 2) {
        console.log(`Too many inputs! Please enter username followed by repo name ONLY.`);
    } else {
        console.log('Welcome to the GitHub Avatar Downloader!');
        getRepoContributors(userName, repo, function (error, response, result) {
            please.checkForErrorsAndGo(response.statusCode, result, function() {
                let userInfo = JSON.parse(result);
                userInfo.forEach(function (element, i) {
                    var uName = element.login;
                    var thisFilePath = `${imageFolder}${uName}.jpg`;
                    downloadImageByURL(userInfo[i]["avatar_url"], thisFilePath);
                });
            });
        });
    }
} else {
    console.log('Oops! Looks like there is something wrong with your GITHUB_TOKEN assignment in the .env!');
}