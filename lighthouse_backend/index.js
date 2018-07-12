var express = require('express');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

var app = express();
app.get('/', function (req, res) {
  const flags = {
    onlyCategories: ['accessibility'],
    chromeFlags: ['--headless', '--disable-gpu']
  };

  let url = req.query.site
  console.log(url);
  if (url) {
    launchChromeAndRunLighthouse(url, flags).then((results) => {
      res.send({ score: results.categories.accessibility.score });
    }).catch(error => {
      console.log(error)
      res.send({ score: 0 });
    });
  } else {
    res.send({ score: 0 });
  }
});

app.listen(3000);

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    }).catch(error => {
      console.log('error', error);
      return chrome.kill()
    });
  });
  return console.log('2')
}
