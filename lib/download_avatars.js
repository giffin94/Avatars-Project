require("dotenv").load();
var request = require('request');
var fs = require('fs');
// var gitInfo = process.argv.slice(2);
// var repo = gitInfo[0];
// var userName = gitInfo[1];

var repo = 'Avatars-Project';
var userName = 'giffin94';

// var options = {};

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

// request.get('https://sytantris.github.io/http-examples/future.jpg')
//     .on('error', function (err) {
//         throw err;
//     })
//     .on('response', function (response) {
//         console.log('Response Status Code: ', response.statusMessage, response.headers['content-type']);
//         console.log('Download starting...');
//     }).on('end', function (response) {
//         console.log('Download complete!');
//     }).pipe(fs.createWriteStream('./tmp/downloaded.html'));


getRepoContributors(userName, repo, function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", JSON.parse(result));
});