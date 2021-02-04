if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
  console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
  // res.header("x-force-error-mode", "all")

  if (req.method === 'OPTIONS') {
      // CORS Preflight
      res.send();
  } else {
    const token = req.header('Web-Token');
    if (token === null) {
      return res.sendStatus(401) // If there isn't any token
    } else if (token !== process.env.ACCESS_TOKEN_SECRET) {
      return res.sendStatus(403) // If wrong token
    } else {
      var targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.
      if (!targetURL) {
          res.status(500).send( { error: 'There is no Target-Endpoint header in the request' });
          return;
      }
      request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
          function (error, response, body) {
              if (error) {
                  console.error('error: ' + response.statusCode)
              }
          }).pipe(res);
    }
  }
});


app.set('port', process.env.PORT || 3010);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
