// Convert fetchMock data to getProduct API response format
const processColors = require("./process-colors.js");
const createResponse = (array, val, val_two) => {
  return array.map(({ ...item }, index) => {
    index === 0
      ? (item.availability = val)
      : (item.availability = val_two);
    item.color = processColors(item.color);
    return item;
  });
};

module.exports = createResponse;
