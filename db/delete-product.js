const query = require("./query.js");
const format = require("pg-format");

const deleteProduct = async (product, productIDs) => {
  // Keep DB in sync with latest API fetch
  try {
    let deleteSelect = format("SELECT %I FROM %I", "id", product);
    let tableIDs = await query(deleteSelect);
    tableIDs.rows.forEach((row) => {
      if (!productIDs.includes(row.id)) {
        // Delete the record
        let deleteQuery = format(
          "DELETE FROM %I WHERE %I = %L",
          product,
          "id",
          row.id
        );
        query(deleteQuery);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = deleteProduct;
