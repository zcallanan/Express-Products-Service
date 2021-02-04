import query from '../db/index.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

/*
  1. Get raw product data
  2. Parse manufacturers
  3. Get manufacturer data x 6
  4. Find availability of each product
  5. Construct product data with availability
  6. Save to DB
*/

const fetchProductData = async (product) => {
  let productList = [];
  let manufacturers = [];

  const url = `${process.env.PRODUCT_URL}${product}`; // Build URL
  let data;
  try {
    // Try to get the data
      const response = await fetch(url)
      data = await response.json()

    if (await Array.isArray(data) && data.length) {
      await data.forEach(item => {
        // Build manufacturers array
        if (!manufacturers.includes(item.manufacturer)) {
          manufacturers.push(item.manufacturer);
        }
        // Build the products list
        productList.push(item);

        // Process colors
        let colors = "";
        if (item.color.length > 1) {
          item.color.forEach((color, index) => {
            if (item.color.length - 1 === index){
              colors += `${color}`
            } else {
              colors += `${color} | `
            }
          })
        } else {
          colors = item.color[0];
        }

        const getStatus = async () => {
            try {
              // Check status
              let result = await query(`SELECT EXISTS(SELECT 1 FROM ${product} WHERE id = $1)`, [item.id]);
              // If it does not exist, insert
              if (!result.rows[0].exists) {
                console.log('yes')
                // Insert ion
                query(`INSERT INTO ${product} (id, type, name, color, price, manufacturer, availability) \
                  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [item.id,
                item.type,
                item.name,
                colors,
                item.price,
                item.manufacturer,
                ""]);
              } else {
                // TODO: If it does exist, check if it needs to be updated
              }
            } catch(err) {
              console.log(err)
            }
          }

        // Save product list to DB
        try {
          // Test if an ID exists in the product's DB
          getStatus();
        } catch(err) {
          console.log(err);
        }

      })

    } else if (await !Array.isArray(data.response)) {
      console.log('failed, try again!')
      fetchProducts(url);
    }
  } catch(err) {
     // TODO: Handle
     return err
  }
  return manufacturers;
}

export default fetchProductData;



