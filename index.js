const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const getProductItems = require("./api/get-product-items.js");
const cronFetch = require("./jobs/cron-fetch.js");
const subscriberInit = require("./shared/subscriber-init.js");

if (process.env.NODE_ENV !== "production") dotenv.config();

// App Setup
const app = express();
const port = process.env.NODE_ENV === "test" ? 3020 : process.env.PORT || 3010;

// Port
app.set("port", port);

if (process.env.NODE_ENV !== "test") {
  app.listen(app.get("port"), () => {
    console.log("Proxy server listening on port " + app.get("port"));
  });
}

// Handle CORS
app.use(cors());

var myLimit =
  typeof process.argv[2] !== "undefined" ? process.argv[2] : "100kb";

app.use(
  bodyParser.json({
    limit: myLimit,
  })
);

if (process.env.NODE_ENV === "development") {
  // Run DB update Job every CRON_IN_MINUTES
  cronFetch();

  // Subscribe to Redis keyspace channels
  subscriberInit();
}

// Auth
app.get("*", (req, res, next) => {
  const token = req.header("X-WEB-TOKEN");
  if (!token) {
    return res
      .status(401)
      .send("Proper authorization credentials were not provided."); // If there isn't any token
  } else if (token !== process.env.ACCESS_TOKEN_SECRET) {
    return res
      .status(403)
      .send("Invalid authentication credentials."); // If wrong token
  } else {
    next();
  }
});

// Return custom API response from DB
app.get("/", (req, res) => {
  getProductItems(req, res);
});

module.exports = { app };
