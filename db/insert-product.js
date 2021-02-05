import query from '../db/index.js';
import updateProduct from '../db/update-product.js'

const insertProduct = async (product, item, colors) => {
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
      updateProduct(product, item, colors);

    }
  } catch(err) {
    console.log(err)
  }
}

export default insertProduct;
