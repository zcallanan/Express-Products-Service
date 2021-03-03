const query = require('../db/index.js');
const fetch = require('node-fetch');
const fetchManufacturerAvailability = require('./fetch-manufacturer-availability.js');
const updateAvailability = require('../db/update-availability.js');
const insertProduct = require('../db/insert-product.js');
const deleteProduct = require('../db/delete-product.js');
const { getResult, client } = require("../shared/init-redis-client.js");
const { PRODUCT_URL, CACHE_TIMER } = require("../shared/constants.js");

const processColors = (colorArray) => {
  let colors = "";
  if (colorArray.length > 1) {
    colorArray.forEach((color, index) => {
      (colorArray.length - 1 === index) ? colors += `${color}` : colors += `${color}, `;
    });
  } else {
    colors = colorArray[0];
  };
  return colors;
};

const fetchProducts = async (product) => {
  let productIDs = [];
  let manufacturers = [];

  const url = `${PRODUCT_URL}${product}`; // Build URL
  let data;
  try {
    // Try to get the data
    const response = await fetch(url);
    data = await response.json();

    if (await Array.isArray(data) && data.length) {
      // If response is an array and has length

      // Keep DB in sync with latest API call by deleting records
      deleteProduct(product, productIDs);

      let manufacturers = [];

      await data.forEach(item => {
        // Build manufacturers array
        if (!manufacturers.includes(item.manufacturer)) manufacturers.push(item.manufacturer);

        // Build an array of product IDs
        productIDs.push(item.id);

        // Process colors
        let colors = processColors(item.color);

        // Test if an ID exists in the product's DB, insert else update
        insertProduct(product, item, colors);
      })

      // Get availability data
      for (const manufacturer of manufacturers) {
        let manufacturersFetched = JSON.parse(await getResult('manufacturer-list'));

        if (!manufacturersFetched) {
          manufacturersFetched = {
            'manufacturer-list': []
          };
          console.log('init', manufacturersFetched);
        };
        if (!manufacturersFetched['manufacturer-list'].includes(manufacturer)) {
          // IF not in Redis, fetch it
          console.log('Calling to fetch', manufacturersFetched['manufacturer-list'], 'does not include', manufacturer);
          fetchManufacturerAvailability(manufacturer, product);

          // Save manufacturer to Redis
          manufacturersFetched['manufacturer-list'].push(manufacturer);
          client.set('manufacturer-list', JSON.stringify({
            'manufacturer-list': manufacturersFetched['manufacturer-list']
          }), 'EX', CACHE_TIMER);
        };
      };
    } else if (await !Array.isArray(data.response)) {
      // Make the request again
      console.log(`failed to fetch ${product} try again!`);
      fetchProducts(product);
    };
  } catch(err) {
     fetchProducts(product);
     console.log(err);
  };
};

module.exports = fetchProducts;




