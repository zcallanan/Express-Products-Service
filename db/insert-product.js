const query = require('./index.js');
const updateProduct = require('../db/update-product.js');
const format = require('pg-format');

const insertProduct = async (product, item, colors) => {
  try {
    // Check status
    let insertSelect = format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)', product, 'id', item.id);
    let result = await query(insertSelect);
    // If it does not exist, insert

    if (!result.rows[0].exists) {
      let insertQuery = format('INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) \
        VALUES (%L, %L, %L, %L, %L, %L, %L)', product,
        'id', 'type', 'name', 'color', 'price', 'manufacturer', 'availability',
        item.id, item.type, item.name, colors, item.price, item.manufacturer, "Availability Unknown"
        );
      query(insertQuery);
    } else {
      // If it does exist, check if it needs to be updated
      updateProduct(product, item, colors);
    };
  } catch(err) {
    console.log(err);
  };
};

module.exports = insertProduct;
