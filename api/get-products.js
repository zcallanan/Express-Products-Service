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
        let colors = processColors(item.color)

        const getRecordValues = async () => {
          try {
            let recordValues = await query(`SELECT (type, name, color, price, manufacturer) FROM ${product} WHERE id = $1`, [item.id]);
            // Split to get each column value
            let array = recordValues.rows[0].row.split(',');

            let string = "";
            let stringValues = "";
            const updateObject ={
              array: []
            };

            if (item.type !== array[0].replace(/\"|\(+/g, '')) {
              // Update type in DB
              updateObject.typeString = `type = $${updateObject.array.length + 1}::text`; // $1
              updateObject.array.push(item.type);
              stringValues += updateObject.typeString;
            }

            if (item.name !== array[1].replace(/["]+/g, '')) {
              // Update name in DB
              updateObject.nameString = `name = $${updateObject.array.length + 1}::text`; // $2
              updateObject.array.push(item.name);
              stringValues += updateObject.nameString;
            }

            if (colors !== array[2].replace(/["]+/g, '')) {
              // Update color in DB
              updateObject.colorString = `color = $${updateObject.array.length + 1}::text`; // $3
              updateObject.array.push(colors);
              stringValues += updateObject.colorString;
            }
            if (item.price !== Number.parseInt(array[3])) {
              // Update price in DB
              updateObject.priceString = `price = $${updateObject.array.length + 1}::int`; // $4
              updateObject.array.push(item.price);
              stringValues += updateObject.priceString;
            }
            if (item.manufacturer !== array[4].replace(/\"|\)+/g, '')) {
              // Update manufacturer in DB
              updateObject.manufacturerString = `manufacturer = $${updateObject.array.length + 1}::text`; // $5
              updateObject.array.push(item.manufacturer);
              stringValues += updateObject.manufacturerString;
            }

            if (updateObject.array.length > 1) {
              console.log('??')
              // if there's an update string, remove the last comma
              stringValues = stringValues.slice(0, stringValues.length - 2) + stringValues.slice(stringValues.length - 1);
            }

            if (updateObject.array.length) {
              updateObject.array.push(item.id);
            }

            // UPDATE beanies SET name = $1 WHERE id = $2
            let updateString = `UPDATE ${product} SET ${stringValues} WHERE id = $${updateObject.array.length}`;
            if (updateObject.array.length) {
              query(`${updateString}`, updateObject.array);
            }
          } catch (err) {
            console.log(err);
          }
        }

        const getStatus = async () => {
          try {
            // Check status
            let result = await query(`SELECT EXISTS(SELECT 1 FROM ${product} WHERE id = $1)`, [item.id]);
            // If it does not exist, insert

            if (!result.rows[0].exists) {

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
              // If it does exist, check if it needs to be updated
              getRecordValues();

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



