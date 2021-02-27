const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const getProductItems = require('./db/get-product-items.js')
const cronFetch = require('./jobs/cron-fetch.js');

const app = express();
const port = process.env.PORT || 3010;

// Port
app.set('port', port);

app.listen(app.get('port'), () => {
  console.log('Proxy server listening on port ' + app.get('port'));
});

// Handle CORS
app.use(cors());

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
  console.log('Using limit: ', myLimit);

app.use(bodyParser.json({
  limit: myLimit
}));

// Environment vars
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();

  // Run DB update Job every CRON_IN_MINUTES
  cronFetch();
}

// Auth
app.get('*', (req, res, next) => {
  const token = req.header('X-WEB-TOKEN');
  if (!token) {
    return res.sendStatus(401) // If there isn't any token
  } else if (token !== process.env.ACCESS_TOKEN_SECRET) {
    return res.sendStatus(403) // If wrong token
  } else {
    next()
  }
});

// Return custom API response from DB
app.get('/', (req, res) => {
  getProductItems(req, res);
})






