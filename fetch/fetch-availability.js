const fetch = require("node-fetch");
const { getResult, client } = require("../shared/redis-client.js");
const { MANUFACTURER_URL, CACHE_TIMER } = require("../shared/constants.js");

// Get Manufacturer Availability
const fetchManufacturerAvailability = async (manufacturer, product) => {
  // // Check if Redis has data for the manufacturer
  let result = JSON.parse(await getResult(manufacturer));
  let resValue = {};
  if (!result) {
    // No manufacturer data in hash, fetch it
    console.log("Fetching data for", product, manufacturer, result);
    const url = `${MANUFACTURER_URL}${manufacturer}`; // Build URL
    let data;

    try {
      // Try to get the data
      const response = await fetch(url);
      data = await response.json();

      if ((await Array.isArray(data.response)) && data.response.length) {
        console.log(`${manufacturer} data is valid`);
        // If response is an array and has length store in Redis then update
        // Save object to redis as a hash
        resValue[manufacturer] = data.response;
        client.set(manufacturer, JSON.stringify(resValue), "EX", CACHE_TIMER);
      } else if (await !Array.isArray(data.response)) {
        // Make the request again
        console.log(`Failed, retrying for ${manufacturer}, ${product}!`);
        fetchManufacturerAvailability(manufacturer, product);
      }
    } catch (err) {
      console.log(err);
      console.log(`Retrying for ${manufacturer} - ${product}`);
      fetchManufacturerAvailability(manufacturer, product);
    }
  }
};

module.exports = fetchManufacturerAvailability;
