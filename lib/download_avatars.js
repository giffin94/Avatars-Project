require("dotenv").load();
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
        cb(err, body);
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
    }).pipe(fs.createWriteStream(filePath)) 
};

if(gitInfo.length < 2) {
    console.log(`Please include a user and a repo!`);
} else {
    console.log('Welcome to the GitHub Avatar Downloader!');
    
    getRepoContributors(userName, repo, function(err, result) {
        console.log("Errors:", err);
        var userInfo = JSON.parse(result);
        console.log(result);
        userInfo.forEach(function(element, i) {
            var uName = userInfo[i]["login"];
            var thisFilePath = `./avatars/${uName}.jpg`;
            downloadImageByURL(userInfo[0]["avatar_url"], thisFilePath);
        });
    });
}


