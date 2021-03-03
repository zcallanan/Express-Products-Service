const query = require("./index.js");
const format = require("pg-format");
const { getRedisValue } = require("../shared/init-redis-client.js");

const updateAvailability = async (manufacturers, product) => {
  // Keep DB in sync with latest API fetch
  try {
    let productsQuery = format(
      "SELECT %I, %I FROM %I",
      "id",
      "availability",
      product
    );
    let tableIDs = await query(productsQuery);
    let datapayload;
    let ind;
    let availability;

    for (const manufacturer of manufacturers) {
      let manufacturerPromise = getRedisValue(manufacturer);
      manufacturerPromise.then((manufacturerData) => {
        manufacturerData[manufacturer].forEach((value) => {
          // Each value found in manufacturer's availability data
          ind = tableIDs.rows.findIndex((x) => x.id === value.id.toLowerCase());
          if (ind !== -1) {
            // ind equals -1 if id not found in data response (product records)
            datapayload = value.DATAPAYLOAD.match(
              /<INSTOCKVALUE>(.*)<\/INSTOCKVALUE>/
            );
            if (datapayload) {
              if (datapayload[1] === "OUTOFSTOCK") {
                availability = "Out of Stock";
              } else if (datapayload[1] === "INSTOCK") {
                availability = "In Stock";
              } else if (datapayload[1] === "LESSTHAN10") {
                availability = "Less Than 10";
              }
            }

            // If API response's availability differs from what is in the DB
            if (availability !== tableIDs.rows[ind].availability) {
              let availabilityUpdate = format(
                "UPDATE %I SET %I = %L WHERE id = %L",
                product,
                "availability",
                availability,
                value.id.toLowerCase()
              );
              query(availabilityUpdate);
            }
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateAvailability;
