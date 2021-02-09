const request = require('request');
// Serves as a web proxy between third party product APIs and client

const appV1 = (req, res) => {
  var targetURL = req.header('Target-URL');
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

module.exports = appV1;
