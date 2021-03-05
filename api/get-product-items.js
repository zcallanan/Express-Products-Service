const query = require("../db/query.js");
const format = require("pg-format");
const {
  PRODUCT_LIST,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV
} = require("../shared/constants.js");
const {
  getRedisValue,
  getResult,
  client,
} = require("../shared/redis-client.js");

const getProductItems = async (req, res) => {
  try {
    const productReq = req.header("X-PRODUCT");
    // Handle nonexistent product requests
    let product = PRODUCT_LIST.includes(productReq) ? productReq : null;

    if (!product) {
      res
        .status(404)
        .send(`The requested product ${productReq} does not exist.`);
    } else {
      // Get product's stored hash if available
      let result =
        NODE_ENV === "test"
          ? JSON.parse(await getResult(`${product}_test`))
          : JSON.parse(await getResult(product));

      let resValue = {};

      if (!result) {
        // If no stored hash, get it from the DB
        let queryString = format("SELECT * FROM %I", product);

        result = await query(queryString);

        resValue[product] = result.rows;

        // Handle different cache timers
        const cache =
          NODE_ENV !== "test" ? CACHE_TIMER : TEST_CACHE_TIMER;

        // Add _test to product
        if (NODE_ENV === "test") product = `${product}_test`;

        // Save object to redis as a hash
        client.set(product, JSON.stringify(resValue), "EX", cache);
      } else {
        // If there is a hash
        if (NODE_ENV === "test") {
          // Rename key
          let rename;
          if (product === "beanies") {
            rename = ({ [product]: beanies_test }) => ({ beanies_test });
          } else if (product === "facemasks") {
            rename = ({ [product]: facemasks_test }) => ({ facemasks_test });
          } else if (product === "gloves") {
            rename = ({ [product]: gloves_test }) => ({ gloves_test });
          }
          resValue = rename(result);
        } else {
          resValue = result;
        }
      }
      res.json(resValue);
    }
  } catch (err) {
    console.log("getProduct failed!");
    console.log(err);
  }
};

module.exports = getProductItems;
