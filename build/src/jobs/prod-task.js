"use strict";
var fetchProductData = require("../fetch/fetch-products.js");
var subscriberInit = require("../shared/subscriber-init.js");
var _a = require("../shared/constants.js"), PRODUCT_LIST = _a.PRODUCT_LIST, TIMEOUT = _a.TIMEOUT;
subscriberInit();
PRODUCT_LIST.forEach(function (product, index) {
    return setTimeout(fetchProductData, 5000 * index, product);
});
// Kill script if it hasn't killed itself
setTimeout(function () {
    console.log("timeout");
    return process.exit(22);
}, TIMEOUT);
