"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertRows = exports.truncTables = void 0;
// Setup db reset
var query_1 = __importDefault(require("../../db/query"));
var pg_format_1 = __importDefault(require("pg-format"));
var constants_1 = require("../../shared/constants");
var product_data_1 = require("../data/product-data");
var truncateQuery;
var insertQuery;
var truncTables = function () {
    if (constants_1.NODE_ENV === "test") {
        constants_1.PRODUCT_LIST.forEach(function (product) {
            truncateQuery = pg_format_1.default("TRUNCATE TABLE ONLY %I", product);
            query_1.default(truncateQuery);
        });
    }
};
exports.truncTables = truncTables;
var insert = function (product, item) {
    insertQuery = pg_format_1.default("INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) \
      VALUES (%L, %L, %L, %L, %L, %L, %L)", product, "id", "type", "name", "color", "price", "manufacturer", "availability", item.id, item.type, item.name, item.color, item.price, item.manufacturer, item.availability);
    query_1.default(insertQuery);
};
var insertRows = function () {
    if (constants_1.NODE_ENV === "test") {
        constants_1.PRODUCT_LIST.forEach(function (product) {
            if (product === "beanies") {
                product_data_1.beaniesData.forEach(function (item) { return insert(product, item); });
            }
            else if (product === "facemasks") {
                product_data_1.facemasksData.forEach(function (item) { return insert(product, item); });
            }
            else if (product === "gloves") {
                product_data_1.glovesData.forEach(function (item) { return insert(product, item); });
            }
        });
    }
};
exports.insertRows = insertRows;
