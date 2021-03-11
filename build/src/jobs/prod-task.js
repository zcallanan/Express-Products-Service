"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_products_1 = __importDefault(require("../fetch/fetch-products"));
var subscriber_init_1 = __importDefault(require("../shared/subscriber-init"));
var constants_1 = require("../shared/constants");
subscriber_init_1.default();
constants_1.PRODUCT_LIST.forEach(function (product, index) {
    return setTimeout(fetch_products_1.default, 5000 * index, product);
});
// Kill script if it hasn't killed itself
setTimeout(function () {
    console.log("timeout");
    return process.exit(22);
}, constants_1.TIMEOUT);
