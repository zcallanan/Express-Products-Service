// Setup fetchMock
const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

// Setup db reset
const query = require("../../db/query.js");
const format = require("pg-format");
const { PRODUCT_LIST, NODE_ENV } = require("../../shared/constants.js");
const {
  beaniesData,
  facemasksData,
  glovesData,
} = require("../data/product-data.js");
let truncateQuery;
let insertQuery;

const truncTables = () => {
  if (NODE_ENV === "test") {
    PRODUCT_LIST.forEach((product) => {
      truncateQuery = format("TRUNCATE TABLE ONLY %I", product);
      query(truncateQuery);
    });
  }
};

const insert = (product, item) => {
  insertQuery = format(
    "INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) \
      VALUES (%L, %L, %L, %L, %L, %L, %L)",
    product,
    "id",
    "type",
    "name",
    "color",
    "price",
    "manufacturer",
    "availability",
    item.id,
    item.type,
    item.name,
    item.color,
    item.price,
    item.manufacturer,
    item.availability
  );
  query(insertQuery);
};

const insertRows = () => {
  if (NODE_ENV === "test") {
    PRODUCT_LIST.forEach((product) => {
      if (product === "beanies") {
        beaniesData.forEach((item) => insert(product, item));
      } else if (product === "facemasks") {
        facemasksData.forEach((item) => insert(product, item));
      } else if (product === "gloves") {
        glovesData.forEach((item) => insert(product, item));
      }
    });
  }
};

module.exports = { truncTables, insertRows };