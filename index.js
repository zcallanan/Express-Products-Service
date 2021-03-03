const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const getProductItems = require("./db/get-product-items.js");
const cronFetch = require("./jobs/cron-fetch.js");
const updateAvailability = require("./db/update-availability.js");

// Init Redis
const { promisify } = require("util");
const redis_url = process.env.REDIS_URL || null;
const subscriber = require("redis").createClient(redis_url);
const client = require("redis").createClient(redis_url);
const getAsync = promisify(client.get).bind(client);
const cacheTimer = process.env.CACHE_TIMER || 300;

// App Setup
const app = express();
const port = process.env.PORT || 3010;

// Port
app.set("port", port);

app.listen(app.get("port"), () => {
  console.log("Proxy server listening on port " + app.get("port"));
});

// Handle CORS
app.use(cors());

var myLimit = typeof process.argv[2] != "undefined" ? process.argv[2] : "100kb";
console.log("Using limit: ", myLimit);

app.use(
  bodyParser.json({
    limit: myLimit,
  })
);

// Environment vars
if (process.env.NODE_ENV !== "production") {
  dotenv.config();

  // Run DB update Job every CRON_IN_MINUTES
  cronFetch();
}

// Auth
app.get("*", (req, res, next) => {
  const token = req.header("X-WEB-TOKEN");
  if (!token) {
    return res.sendStatus(401); // If there isn't any token
  } else if (token !== process.env.ACCESS_TOKEN_SECRET) {
    return res.sendStatus(403); // If wrong token
  } else {
    next();
  };
});

// Return custom API response from DB
app.get("/", (req, res) => {
  getProductItems(req, res);
});

// Get value from Redis that depends upon an async call
const getResult = async (val) => {
  try {
    return await getAsync(val);
  } catch (err) {
    console.log(err);
  };
};

const getRedisValue = async (key) => JSON.parse(await getResult(key));

const KEY_EVENT_SET = "__keyevent@0__:set";
let updatePromise;
let manufacturersPromise;

const ignoreKeyList = ["manufacturer-list", "beanies", "facemasks", "gloves"];

subscriber.on("pmessage", (pattern, channel, message) => {
  console.log(
    "(" +
      pattern +
      ")" +
      " client received message on " +
      channel +
      ": " +
      message
  );
  if (channel === KEY_EVENT_SET && !ignoreKeyList.includes(message)) {
    manufacturersPromise = getRedisValue("manufacturer-list");
    updatePromise = getRedisValue("update-ready");
    manufacturersPromise.then((manufacturers) => {
      if (manufacturers["manufacturer-list"].includes(message)) {
        updatePromise.then((updateReady) => {
          if (!updateReady) {
            updateReady = { "update-ready": [message] };
            console.log("Init:", updateReady);
          } else {
            if (!updateReady["update-ready"].includes(message)) {
              updateReady["update-ready"].push(message);
              console.log("Add to updateReady array:", updateReady);
            };
          };
          client.set(
            "update-ready",
            JSON.stringify(updateReady),
            "EX",
            cacheTimer
          );
        });
      };
      if (message === "update-ready") {
        updatePromise.then((updateReady) => {
          if (updateReady["update-ready"].length === 6) {
            console.log("Update is a go", manufacturers["manufacturer-list"]);
            const products = ["beanies", "facemasks", "gloves"];
            products.forEach((product, index) =>
              setTimeout(
                updateAvailability,
                100 * index,
                manufacturers["manufacturer-list"],
                product
              )
            );
          };
        });
      };
    });
  };
});
subscriber.psubscribe("__key*__:*");
