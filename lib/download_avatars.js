try{
    require("dotenv").load();
}

catch(err) {
    console.log('.env file is missing! Please make sure you have a .env file with your personal GitHub token!');
}


const imageFolder = './avatars/';
var request = require('request');
var fs = require('fs');
var gitInfo = process.argv.slice(2);
var userName = gitInfo[0];
var repo = gitInfo[1];



function getRepoContributors(repoOwner, repoName, cb) {
   //gets repo contributors using a username and a repo name to create a path
    var endPath = '/contributors'
    var options = {
        url: `https://api.github.com/repos/${repoOwner}/${repoName}${endPath}`,
        qs: {
            access_token: process.env.GITHUB_TOKEN
            },
        headers: {
            'user-agent': 'giffin94'
        }
    }
    
    getThisStuff(options, cb);
}

function getThisStuff(options, cb) {
    request(options, function(err, res, body){
        cb(err, res, body);
    }); //goes to the requested path on Github and invokes a specified callback - VERY GENERAL USE
}

function showDownloadResponse(response) {
    console.log('Response Status Code: ', response.statusMessage, response.headers['content-type']);
    console.log('Download starting...');
};

function showDownloadComplete() {
    console.log('Download complete!');
}

function handleNoFolder (err) {
    if(err.code === 'ENOENT'){
        console.log("No 'avatars' directory! Please create an empty avatars folder");
    } else {
        console.log(err);
    }
}

function downloadImageByURL(url, filePath) {
    request(url)
    .on('error', function (err) {
        throw err;
    })
    .on('response', showDownloadResponse)
    .on('end', showDownloadComplete)
    .pipe(fs.createWriteStream(filePath)
    .on('error', handleNoFolder))
};

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

if(process.env.GITHUB_TOKEN) {

    if(gitInfo.length < 2) {
        console.log(`Please include a user and a repo!`);
    } else if(gitInfo.length > 2) {
        console.log(`Too many inputs! Please enter username followed by repo name ONLY.`);
    } else {
        console.log('Welcome to the GitHub Avatar Downloader!');
    
        getRepoContributors(userName, repo, function(error, response, result) {
            var userInfo = JSON.parse(result);
            checkForErrorsAndGo(response.statusCode, userInfo, downloadImageByURL);
        });
    }
} else {
    console.log('Oops! Looks like there is something wrong with your GITHUB_TOKEN assignment in the .env!');
}