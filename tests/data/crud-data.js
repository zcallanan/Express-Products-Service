const { processColors } = require("../../fetch/fetch-products.js");

// FetchMock data for db insertion
const insertData = [
  {
    id: "0016516931359f9277205a0f",
    name: "ILLEAKOL METROPOLIS STAR",
    type: "beanies",
    manufacturer: "ippal",
    color: ["yellow", "grey"],
    price: 51,
  },
  {
    id: "003911ce74aeef0d5c6250",
    name: "TAIAKSOP BRIGHT BUCK",
    type: "beanies",
    manufacturer: "juuran",
    color: ["green"],
    price: 44,
  },
  {
    id: "91afd5d90ff9a173b5be",
    name: "REVUPVE BUCK",
    type: "beanies",
    manufacturer: "abiplos",
    color: ["grey"],
    price: 91,
  },
];

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

// Fetchmock manufacturer availability data
const ippalData = {
  code: 200,
  response: [
    {
      id: "0016516931359F9277205A0F",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

const juuranData = {
  code: 200,
  response: [
    {
      id: "003911CE74AEEF0D5C6250",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

const abiplosData = {
  code: 200,
  response: [
    {
      id: "91AFD5D90FF9A173B5BE",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

// Convert fetchMock data to getProduct API response format
const createResponse = (array) => {
  return array.map(({ ...item }, index) => {
    index === 0
      ? (item.availability = "In Stock")
      : (item.availability = "Out of Stock");
    item.color = processColors(item.color);
    return item;
  });
};

// Insert response to be tested
let insertRes = {
  beanies: createResponse(insertData),
};

let deleteRes = {
  beanies: createResponse(deleteData),
};

module.exports = {
  insertData,
  ippalData,
  juuranData,
  abiplosData,
  insertRes,
  deleteData,
  deleteRes,
};
