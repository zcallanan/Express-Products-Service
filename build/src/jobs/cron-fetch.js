"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = __importDefault(require("node-cron"));
var fetch_products_1 = __importDefault(require("../fetch/fetch-products"));
var constants_1 = require("../shared/constants");
var task = node_cron_1.default.schedule("*/" + constants_1.CRON_IN_MINUTES + " * * * *", function () {
    constants_1.PRODUCT_LIST.forEach(function (product, index) {
        return setTimeout(fetch_products_1.default, 5000 * index, product);
    });
}, {
    scheduled: false,
});
var cronFetch = function () {
    if (constants_1.START_CRON) {
        console.log("start cron");
        task.start();
    }
    if (constants_1.END_CRON) {
        console.log("end cron");
        task.end();
    }
};
exports.default = cronFetch;
