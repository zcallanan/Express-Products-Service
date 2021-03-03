const query = require("./index.js");
const format = require("pg-format");
const { getRedisValue, getResult, client } = require("../shared/init-redis-client.js");
const { CACHE_TIMER } = require("../shared/constants.js");

const getProductItems = async (req, res) => {
  // Get product's stored hash if available
  let result = JSON.parse(await getResult(req.header('X-PRODUCT')));
  let resValue = {};

  if (!result) {
    // If no stored hash, get it from the DB
    let queryString = format("SELECT * FROM %I", req.header("X-PRODUCT"));
    result = await query(queryString);

    resValue[req.header("X-PRODUCT")] = result.rows;
    // Save object to redis as a hash
    client.set(
      req.header("X-PRODUCT"),
      JSON.stringify(resValue),
      "EX",
      CACHE_TIMER
    );
  } else {
    resValue = result;
  }
  res.json(resValue);
};

module.exports = getProductItems;
