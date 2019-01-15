try{
    require("dotenv").load();
}

catch(err) {
    console.log('.env file is missing! Please make sure you have a .env file with your personal GitHub token!');
}

var request = require('request');
var fs = require('fs');
var gitInfo = process.argv.slice(2);
var userName = gitInfo[0];
var repo = gitInfo[1];



function getRepoContributors(repoOwner, repoName, cb) {
    request({
        url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
        qs: {
            access_token: process.env.GITHUB_TOKEN
        },
        headers: {
            'user-agent': 'giffin94'
        }
    }, function(err, res, body) {
        cb(err, res, body);
    });
}

function downloadImageByURL(url, filePath) {
    request(url)
    .on('error', function (err) {
        throw err;
    })
    .on('response', function (response) {
        console.log('Response Status Code: ', response.statusMessage, response.headers['content-type']);
        console.log('Download starting...');
    })
    .on('end', function (response) {
        console.log('Download complete!');
    }).pipe(fs.createWriteStream(filePath)
    .on('error', function (err) {
        if(err.code === 'ENOENT'){
            console.log("No 'avatars' directory! Please create an empty avatars folder");
        } else {
            console.log(err);
        }
    }));
};
if(process.env.GITHUB_TOKEN) {

    if(gitInfo.length < 2) {
        console.log(`Please include a user and a repo!`);
    } else if(gitInfo.length > 2) {
        console.log(`Too many inputs! Please enter username followed by repo name ONLY.`);
    } else {
        console.log('Welcome to the GitHub Avatar Downloader!');
    
        getRepoContributors(userName, repo, function(error, response, result) {
            var userInfo = JSON.parse(result);
            if (response.statusCode > 400) {
                console.log(`Error! The repo you are looking for doesn't exist! Check your spelling. Error: `, response.statusCode);
            } else if (response.statusCode > 500) {
                console.log('Uh-oh! Looks like Github is having some troubles... Error: ', response.statusCode);
            } else {
                userInfo.forEach(function(element, i) {
                var uName = userInfo[i]["login"];
                var thisFilePath = `./avatars/${uName}.jpg`;
                downloadImageByURL(userInfo[0]["avatar_url"], thisFilePath);
                });
            }
            // .on('error', function(err) {
            //     console.log(err);
            // });
        });
    }
} else {
    console.log('Oops! Looks like there is something wrong with your GITHUB_TOKEN assignment in the .env!');
}