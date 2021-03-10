"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMEOUT = exports.IGNORE_LIST = exports.PRODUCT_LIST = exports.END_CRON = exports.START_CRON = exports.CRON_IN_MINUTES = exports.KEY_EVENT_SET = exports.REDIS_URL = exports.TEST_CACHE_TIMER = exports.CACHE_TIMER = exports.MANUFACTURER_URL = exports.PRODUCT_URL = exports.PORT = exports.ACCESS_TOKEN_SECRET = exports.NODE_ENV = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production")
    dotenv_1.default.config();
var NODE_ENV = process.env.NODE_ENV;
exports.NODE_ENV = NODE_ENV;
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
var PORT = Number(process.env.PORT) || 3010;
exports.PORT = PORT;
var PRODUCT_URL = process.env.PRODUCT_URL;
exports.PRODUCT_URL = PRODUCT_URL;
var MANUFACTURER_URL = process.env.MANUFACTURER_URL;
exports.MANUFACTURER_URL = MANUFACTURER_URL;
var CACHE_TIMER = Number(process.env.CACHE_TIMER) || 300;
exports.CACHE_TIMER = CACHE_TIMER;
var TEST_CACHE_TIMER = Number(process.env.TEST_CACHE_TIMER) || 60;
exports.TEST_CACHE_TIMER = TEST_CACHE_TIMER;
var REDIS_URL = process.env.REDIS_URL || undefined;
exports.REDIS_URL = REDIS_URL;
var CRON_IN_MINUTES = Number(process.env.CRON_IN_MINUTES) || 6;
exports.CRON_IN_MINUTES = CRON_IN_MINUTES;
var START_CRON = Number(process.env.START_CRON) || undefined;
exports.START_CRON = START_CRON;
var END_CRON = Number(process.env.END_CRON) || undefined;
exports.END_CRON = END_CRON;
var TIMEOUT = Number(process.env.TIMEOUT);
exports.TIMEOUT = TIMEOUT;
var KEY_EVENT_SET = "__keyevent@0__:set";
exports.KEY_EVENT_SET = KEY_EVENT_SET;
var PRODUCT_LIST = ["beanies", "facemasks", "gloves"];
exports.PRODUCT_LIST = PRODUCT_LIST;
var IGNORE_LIST = [
    "manufacturer-list",
    "beanies",
    "facemasks",
    "gloves",
    "beanies_test",
    "facemasks_test",
    "gloves_test",
];
exports.IGNORE_LIST = IGNORE_LIST;
