import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import appV1 from './api/app-v1.js';
import appV2 from './api/app-v2.js';

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
  // require('dotenv').config();
  dotenv.config();
}

// Port
app.set('port', process.env.PORT || port);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});

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

// Response

app.all('*', (req, res) => {
  req.header('Version') === 'v1' ? appV1(req, res) : appV2(req, res)
})


