try {
    require("dotenv").load();
} catch (err) {
    console.log('.env file is missing! Please make sure you have a .env file with your personal GitHub token!');
}



var request = require('request');
var fs = require('fs');
var gitInfo = process.argv.slice(2);
var userName = gitInfo[0];
var repo = gitInfo[1];
var please = require('../please.js');



function getRepoContributors(repoOwner, repoName, cb) {
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
    .on('error', function (err) {
        throw err;
    })
    .on('response', please.showDownloadResponse)
    .on('end', please.showDownloadComplete)
    .pipe(fs.createWriteStream(filePath)
    .on('error', please.handleNoFolder));
}

if (process.env.GITHUB_TOKEN) {

    if (gitInfo.length < 2) {
        console.log(`Please include a user and a repo!`);
    } else if (gitInfo.length > 2) {
        console.log(`Too many inputs! Please enter username followed by repo name ONLY.`);
    } else {
        console.log('Welcome to the GitHub Avatar Downloader!');
        getRepoContributors(userName, repo, function(error, response, result) {
            var userInfo = JSON.parse(result);
            please.checkForErrorsAndGo(response.statusCode, userInfo, downloadImageByURL);
        });
    }
} else {
    console.log('Oops! Looks like there is something wrong with your GITHUB_TOKEN assignment in the .env!');
}