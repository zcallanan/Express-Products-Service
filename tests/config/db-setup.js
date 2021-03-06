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
  if (NODE_ENV === "test") console.log("Truncating");

  PRODUCT_LIST.forEach((product) => {
    truncateQuery = format("TRUNCATE TABLE ONLY %I", product);
    query(truncateQuery);
  });
};

const insertRows = () => {
  if (NODE_ENV === "test") {
    console.log("Inserting");
    PRODUCT_LIST.forEach((product) => {
      if (product === "beanies") {
        beaniesData.forEach((item) => {
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
        });
      } else if (product === "facemasks") {
        facemasksData.forEach((item) => {
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
        });
      } else if (product === "gloves") {
        glovesData.forEach((item) => {
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
        });
      }
    });
  }
};

module.exports = { truncTables, insertRows };
