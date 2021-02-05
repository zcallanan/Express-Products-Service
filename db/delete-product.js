import query from '../db/index.js';

const deleteProduct = async (product, productIDs) => {
  // Keep DB in sync with latest API fetch
  try {
    let tableIDs = await query(`SELECT id FROM ${product}`);
    tableIDs.rows.forEach(row => {
      if (!productIDs.includes(row.id)) {
        // Delete the record
        let array = [row.id]
        query(`DELETE FROM ${product} WHERE id = $1`, array);
      }
    })
  } catch (err) {
    console.log(err);
  }
}

export default deleteProduct;
