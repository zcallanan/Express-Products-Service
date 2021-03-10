"use strict";
var cron = require("node-cron");
var fetchProductData = require("../fetch/fetch-products.js");
var _a = require("../shared/constants.js"), CRON_IN_MINUTES = _a.CRON_IN_MINUTES, START_CRON = _a.START_CRON, END_CRON = _a.END_CRON, PRODUCT_LIST = _a.PRODUCT_LIST;
var task = cron.schedule("*/" + CRON_IN_MINUTES + " * * * *", function () {
    PRODUCT_LIST.forEach(function (product, index) {
        return setTimeout(fetchProductData, 5000 * index, product);
    });
}, {
    scheduled: false,
});
var cronFetch = function () {
    if (START_CRON) {
        console.log("start cron");
        task.start();
    }
    if (END_CRON) {
        console.log("end cron");
        task.end();
    }
};
module.exports = cronFetch;
