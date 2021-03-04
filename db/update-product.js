const query = require("./query.js");
const format = require("pg-format");

const updateProduct = async (product, item, colors) => {
  try {
    let updateSelect = format(
      "SELECT (%I, %I, %I, %I, %I) \
      FROM %I \
      WHERE %I = %L",
      "type",
      "name",
      "color",
      "price",
      "manufacturer",
      product,
      "id",
      item.id
    );
    let recordValues = await query(updateSelect);
    // Split to get each column value
    let array = recordValues.rows[0].row.split(",");

    let string = "";
    let stringValues = "";
    const updateObject = {
      array: [],
    };

    if (item.type !== array[0].replace(/\"|\(+/g, "")) {
      // Update type in DB
      const cond1 = format("%I = %L", "type", item.type);
      updateObject.array.push(cond1);
    }

    if (item.name !== array[1].replace(/["]+/g, "")) {
      // Update name in DB
      const cond2 = format("%I = %L", "name", item.name);
      updateObject.array.push(cond2);
    }
    let recordColors = array[2].replace(/["]+/g, "");
    if (array.length === 6) {
      // If there are two colors
      recordColors = recordColors + "," + array[3].replace(/["]+/g, "");
    }
    if (colors !== recordColors) {
      // Update color in DB
      const cond3 = format("%I = %L", "color", colors);
      updateObject.array.push(cond3);
    }
    if (item.price !== Number.parseInt(array[array.length - 2])) {
      // Update price in DB
      const cond4 = format("%I = %L", "price", item.price);
      updateObject.array.push(cond4);
    }

    if (item.manufacturer !== array[array.length - 1].replace(/\"|\)+/g, "")) {
      // Update manufacturer in DB
      const cond5 = format("%I = %L", "manufacturer", item.manufacturer);
      updateObject.array.push(cond5);
    }

    if (updateObject.array.length) {
      cond_string = updateObject.array.join(", ");
      let updateQuery = format(
        "UPDATE %I SET %s WHERE %I = %L",
        product,
        cond_string,
        "id",
        item.id
      );
      query(updateQuery);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateProduct;
