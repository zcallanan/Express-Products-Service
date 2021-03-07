const express = require("express");
const cors = require("cors");
const getProductItems = require("./api/get-product-items.js");
const cronFetch = require("./jobs/cron-fetch.js");
const { subscriberInit } = require("./shared/subscriber-init.js");
const {
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  PORT,
} = require("./shared/constants.js");

const app = express();

// Port
const port = NODE_ENV === "test" ? 3020 : PORT;
app.set("port", port);

if (NODE_ENV !== "test")
  app.listen(app.get("port"), () => {
    console.log("Server listening on port " + app.get("port"));
  });

// Handle CORS
app.use(cors());

if (NODE_ENV === "development") {
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
  } else if (token !== ACCESS_TOKEN_SECRET) {
    return res.status(403).send("Invalid authentication credentials."); // If wrong token
  } else {
    next();
  }
});

// Return custom API response from DB
app.get("/", (req, res) => {
  getProductItems(req, res);
});

module.exports = { app };
