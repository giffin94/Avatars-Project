require("dotenv").load();
var request = require('request');
var fs = require('fs');
var gitInfo = process.argv.slice(2);
var userName = gitInfo[0];
var repo = gitInfo[1];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
//   var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
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
    }).pipe(fs.createWriteStream(filePath)) //PROBLEM HERE
};

getRepoContributors(userName, repo, function(err, result) {
    var thisFilePath = `./avatars/${userName}.jpg`;
    console.log(thisFilePath);
    var userInfo = JSON.parse(result);
    console.log("Errors:", err);
    //userInfo.forEach()
    downloadImageByURL(userInfo[0]["avatar_url"], thisFilePath);
});

