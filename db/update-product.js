import query from '../db/index.js';

const updateProduct = async (product, item, colors) => {
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
      updateObject.typeString = `type = $${updateObject.array.length + 1}::text, `; // $1
      updateObject.array.push(item.type);
      stringValues += updateObject.typeString;
    }

    if (item.name !== array[1].replace(/["]+/g, '')) {
      // Update name in DB
      updateObject.nameString = `name = $${updateObject.array.length + 1}::text, `; // $2
      updateObject.array.push(item.name);
      stringValues += updateObject.nameString;
    }

    if (colors !== array[2].replace(/["]+/g, '')) {
      // Update color in DB
      updateObject.colorString = `color = $${updateObject.array.length + 1}::text, `; // $3
      updateObject.array.push(colors);
      stringValues += updateObject.colorString;
    }
    if (item.price !== Number.parseInt(array[3])) {
      // Update price in DB
      updateObject.priceString = `price = $${updateObject.array.length + 1}::int, `; // $4
      updateObject.array.push(item.price);
      stringValues += updateObject.priceString;
    }
    if (item.manufacturer !== array[4].replace(/\"|\)+/g, '')) {
      // Update manufacturer in DB
      updateObject.manufacturerString = `manufacturer = $${updateObject.array.length + 1}::text, `; // $5
      updateObject.array.push(item.manufacturer);
      stringValues += updateObject.manufacturerString;
    }

    if (updateObject.array.length) {
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

export default updateProduct;
