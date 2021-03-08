const createResponse = require("../../shared/create-response.js");

const deleteData = [
  {
    id: "0016516931359f9277205a0f",
    name: "ILLEAKOL METROPOLIS STAR",
    type: "beanies",
    manufacturer: "ippal",
    color: ["yellow", "grey"],
    price: 51,
  },
];

let deleteRes = {
  beanies: createResponse(deleteData, "In Stock", "Out of Stock"),
};

module.exports = { deleteData, deleteRes };
