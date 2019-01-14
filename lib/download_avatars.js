var gitInfo = process.argv.slice(2);
var repo = gitInfo[0];
var userName = gitInfo[1];

console.log(repo, ' ', userName);