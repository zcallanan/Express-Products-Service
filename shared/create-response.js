// Convert fetchMock data to getProduct API response format
const { processColors } = require("../fetch/fetch-products.js");
const createResponse = (array) => {
  return array.map(({ ...item }, index) => {
    index === 0
      ? (item.availability = "In Stock")
      : (item.availability = "Out of Stock");
    item.color = processColors(item.color);
    return item;
  });
};

module.exports = createResponse;
