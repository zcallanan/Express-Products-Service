const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const appV1 = require('./api/app-v1.js');
const getProductItems = require('./db/get-product-items.js')
const cronFetch = require('./jobs/cron-fetch.js');

const app = express();
const port = 3010;

app.use(cors());


var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
  console.log('Using limit: ', myLimit);

app.use(bodyParser.json({
  limit: myLimit
}));

// Environment vars
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Port
app.set('port', process.env.PORT || port);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});

// Run DB update Job every CRON_IN_MINUTES
cronFetch();

// Auth
app.all('*', (req, res, next) => {
  const token = req.header('Web-Token');
  if (token === null) {
    return res.sendStatus(401) // If there isn't any token
  } else if (token !== process.env.ACCESS_TOKEN_SECRET) {
    return res.sendStatus(403) // If wrong token
  } else {
    next()
  }
});

app.all('*', (req, res, next) => {
  if (req.header('Version') === 'v1') {
    // Act as web proxy for third party API
    appV1(req, res)
  } else if (req.header('Version') === 'v2'){
    // Return custom API response from DB
    getProductItems(req, res, next)
  }
})






