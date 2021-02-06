const query = require('../db/index.js');
const format = require('pg-format');

const updateAvailability = async (data, product) => {
  // Keep DB in sync with latest API fetch
  try {
    let productsQuery = format('SELECT %I FROM %I', 'id', product)
    let tableIDs = await query(productsQuery);
    let datapayload;
    let ind;
    let availability;

    data.forEach(value => {
        datapayload = value.DATAPAYLOAD.match(/<INSTOCKVALUE>(.*)<\/INSTOCKVALUE>/);
        ind = tableIDs.rows.findIndex(row => row.id === value.id.toLowerCase());

        if (datapayload) {
          // product[ind].availability can be null, as products is a lot smaller list than all manufacturer listings
          if (datapayload[1] === "OUTOFSTOCK") {
            availability = "Out of Stock"
          } else if (datapayload[1] === "INSTOCK") {
            availability = "In Stock"
          } else if (datapayload[1] === "LESSTHAN10") {
            availability = "Less Than 10"
          }
        }
        // Update DB
        let availabilityUpdate = format('UPDATE %I SET %I = %L WHERE id = %L', product, 'availability', availability, value.id.toLowerCase());
        query(availabilityUpdate);
      })
  } catch (err) {
    console.log(err)
  }
}

module.exports = updateAvailability;
