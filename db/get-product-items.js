const query = require("./index.js");
const format = require("pg-format");
const {
  getRedisValue,
  getResult,
  client,
} = require("../shared/init-redis-client.js");
const { CACHE_TIMER } = require("../shared/constants.js");

const getProductItems = async (req, res) => {
  try {
    // Get product's stored hash if available
    let result =
      process.env.NODE_ENV !== "test"
        ? JSON.parse(await getResult(req.header("X-PRODUCT")))
        : null;

    let resValue = {};

    if (!result) {
      // If no stored hash, get it from the DB
      let queryString = format("SELECT * FROM %I", req.header("X-PRODUCT"));

      result = await query(queryString);

      resValue[req.header("X-PRODUCT")] = result.rows;
      // Save object to redis as a hash
      if (process.env.NODE_ENV !== "test") {
        client.set(
          req.header("X-PRODUCT"),
          JSON.stringify(resValue),
          "EX",
          CACHE_TIMER
        );
      }
    } else {
      resValue = result;
    }
    res.json(resValue);
  } catch (err) {
    console.log("getProduct failed!");
    console.log(err);
  }
};

module.exports = getProductItems;
