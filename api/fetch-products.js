import query from '../db/index.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fetchManufacturerAvailability from './fetch-manufacturer-availability.js';
import insertProduct from '../db/insert-product.js';
import deleteProduct from '../db/delete-product.js';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const processColors = (colorArray) => {
  let colors = "";
  if (colorArray.length > 1) {
    colorArray.forEach((color, index) => {
      if (colorArray.length - 1 === index){
        colors += `${color}`
      } else {
        colors += `${color} - `
      }
    })
  } else {
    colors = colorArray[0];
  }
  return colors;
}

const fetchProducts = async (product) => {
  let productIDs = [];
  let manufacturers = [];

  const url = `${process.env.PRODUCT_URL}${product}`; // Build URL
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
        if (!manufacturers.includes(item.manufacturer)) {
          manufacturers.push(item.manufacturer);
        }

        // Build an array of product IDs
        productIDs.push(item.id);

        // Process colors
        let colors = processColors(item.color)

        // Test if an ID exists in the product's DB, insert else update
        insertProduct(product, item, colors);
      })

      // Fetch availability data
      manufacturers.forEach(manufacturer => {
        // console.log('manufacturers', manufacturers)
        fetchManufacturerAvailability(manufacturer, product);
      });

      return await productIDs;

    } else if (await !Array.isArray(data.response)) {
      // Make the request again
      console.log('failed, try again!')
      fetchProducts(product);
    }
  } catch(err) {
     // TODO: Handle
     return err
  }
}

export default fetchProducts;



