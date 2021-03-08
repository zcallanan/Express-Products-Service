const fetch = require("node-fetch");
const fetchAvailability = require("./fetch-availability.js");
const insertProduct = require("../db/insert-product.js");
const deleteProduct = require("../db/delete-product.js");
const { getResult, client } = require("../shared/redis-client.js");
const processColors = require("../shared/process-colors.js");
const {
  PRODUCT_URL,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV,
} = require("../shared/constants.js");

const fetchProductData = async (product) => {
  let productIDs = [];
  let manufacturers = [];

  const url = `${PRODUCT_URL}${product}`; // Build URL
  let data;
  try {
    // Try to get the data
    const response = await fetch(url);
    data = await response.json();

    if ((await Array.isArray(data)) && data.length) {
      // If response is an array and has length

      // Keep DB in sync with latest API call by deleting records
      deleteProduct(product, productIDs);

      let manufacturers = [];

      await data.forEach((item) => {
        // Build manufacturers array
        if (!manufacturers.includes(item.manufacturer))
          NODE_ENV === "test"
            ? manufacturers.push(`${item.manufacturer}_test`)
            : manufacturers.push(item.manufacturer);

        // Build an array of product IDs
        productIDs.push(item.id);

        // Process colors
        let colors = processColors(item.color);

        // Test if an ID exists in the product's DB, insert else update
        insertProduct(product, item, colors);
      });

      // Get availability data
      const listString =
        NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";

      const cache = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;

      for (const manufacturer of manufacturers) {
        let manufacturersFetched = JSON.parse(await getResult(listString));

        if (!manufacturersFetched) {
          manufacturersFetched = {
            [listString]: [],
          };
          console.log("init", manufacturersFetched);
        }
        if (!manufacturersFetched[listString].includes(manufacturer)) {
          // IF not in Redis, fetch it
          console.log(
            "Calling to fetch",
            manufacturersFetched[listString],
            "does not include",
            manufacturer
          );
          fetchAvailability(manufacturer, product);

          // Save manufacturer to Redis
          manufacturersFetched[listString].push(manufacturer);
          client.set(
            listString,
            JSON.stringify({
              [listString]: manufacturersFetched[listString],
            }),
            "EX",
            cache
          );
        }
      }
    } else if (await !Array.isArray(data.response)) {
      // Make the request again
      console.log(`failed to fetch ${product} try again!`);
      fetchProductData(product);
    }
  } catch (err) {
    fetchProductData(product);
    console.log(err);
  }
};

module.exports = fetchProductData;
