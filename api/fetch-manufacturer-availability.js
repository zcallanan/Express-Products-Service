import query from '../db/index.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import updateAvailability from '../db/update-availability.js';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const fetchManufacturerAvailability = async (manufacturer, product) => {
  const url = `${process.env.MANUFACTURER_URL}${manufacturer}`; // Build URL
  let data;

  try {
    // Try to get the data
    const response = await fetch(url);
    data = await response.json();

    /*
response: Array(6105)
[0 … 99]
0: {id: "DE6394F369B5BCD6F93", DATAPAYLOAD: "<AVAILABILITY>↵  <CODE>200</CODE>↵  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>↵</AVAILABILITY>"}
    */

    if (await Array.isArray(data.response) && data.response.length) {
      // If response is an array and has length

      updateAvailability(data.response, product);

    } else if (await !Array.isArray(data.response)) {
      // Make the request again
      console.log(`failed for ${manufacturer}, ${product}!`)
      fetchManufacturerAvailability(manufacturer, product);
    }
  } catch (err) {
    console.log(err)
  }

}

export default fetchManufacturerAvailability;
