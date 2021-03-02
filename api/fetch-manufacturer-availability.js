const query = require('../db/index.js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { promisify } = require("util");

if (process.env.NODE_ENV !== 'production') dotenv.config();

// Init Redis
const redis_url = process.env.REDIS_URL || null;
const redis = require("redis");
const client = redis.createClient(redis_url);
const cacheTimer = process.env.CACHE_TIMER || 300;

client.on("error", (error) => console.error(error));
const getAsync = promisify(client.get).bind(client);

// Get value from Redis that depends upon an async call
const getResult = async (manufacturer) => {
  try {
    return await getAsync(manufacturer);
  } catch (err) {
    console.log(err);
  };
};

// Get Manufacturer Availability

const fetchManufacturerAvailability = async (manufacturer, product) => {
  // // Check if Redis has data for the manufacturer
  let result = JSON.parse(await getResult(manufacturer));
  let resValue = {};
  if (!result) {
    // No manufacturer data in hash, fetch it
    console.log('Fetching data for', product, manufacturer, result);
    const url = `${process.env.MANUFACTURER_URL}${manufacturer}`; // Build URL
    let data;

    try {
      // Try to get the data
      const response = await fetch(url);
      data = await response.json();

      if (await Array.isArray(data.response) && data.response.length) {
        console.log(`${manufacturer} data is valid`)
        // If response is an array and has length store in Redis then update
        // Save object to redis as a hash
        resValue[manufacturer] = data.response;
        client.set(manufacturer, JSON.stringify(resValue), 'EX', cacheTimer);
        // Evaluate Update
        // console.log(`update for ${manufacturer}, ${product}!`)
        // updateAvailability(data.response, product);
      } else if (await !Array.isArray(data.response)) {
        // Make the request again
        console.log(`Failed, retrying for ${manufacturer}, ${product}!`);
        fetchManufacturerAvailability(manufacturer, product);
      };
    } catch (err) {
      console.log(err)
      console.log(`Retrying for ${manufacturer} - ${product}`);
      fetchManufacturerAvailability(manufacturer, product);
    };
  };
};

module.exports = fetchManufacturerAvailability;
