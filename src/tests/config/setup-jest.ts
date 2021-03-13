// Setup db reset
import format from "pg-format";
import query from "../../db/query";
import { PRODUCT_LIST, NODE_ENV } from "../../shared/constants";
import { beaniesData, facemasksData, glovesData } from "../data/product-data";
import { ProductItemProcessed } from "../../types";

let truncateQuery: string;
let insertQuery: string;

const truncTables = (): void => {
  if (NODE_ENV === "test") {
    PRODUCT_LIST.forEach((product) => {
      truncateQuery = format("TRUNCATE TABLE ONLY %I", product);
      query(truncateQuery);
    });
  }
};

const insert = (product: string, item: ProductItemProcessed): void => {
  insertQuery = format(
    "INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) VALUES (%L, %L, %L, %L, %L, %L, %L)",
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
    item.availability,
  );
  query(insertQuery);
};

const insertRows = (): void => {
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

export { truncTables, insertRows };
