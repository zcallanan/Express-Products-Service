const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const PORT = process.env.PORT || 3010;

const PRODUCT_URL = process.env.PRODUCT_URL;
const MANUFACTURER_URL = process.env.MANUFACTURER_URL;

const CACHE_TIMER = process.env.CACHE_TIMER || 300;
const TEST_CACHE_TIMER = process.env.TEST_CACHE_TIMER || 60;
const REDIS_URL = process.env.REDIS_URL || null;

const CRON_IN_MINUTES = process.env.CRON_IN_MINUTES || 6;
const START_CRON = process.env.START_CRON || null;
const END_CRON = process.env.END_CRON || null;
const TIMEOUT = process.env.TIMEOUT;

const KEY_EVENT_SET = "__keyevent@0__:set";
const PRODUCT_LIST = ["beanies", "facemasks", "gloves"];
const IGNORE_LIST = [
  "manufacturer-list",
  "beanies",
  "facemasks",
  "gloves",
  "beanies_test",
  "facemasks_test",
  "gloves_test",
];

module.exports = {
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  PORT,
  PRODUCT_URL,
  MANUFACTURER_URL,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  REDIS_URL,
  KEY_EVENT_SET,
  CRON_IN_MINUTES,
  START_CRON,
  END_CRON,
  PRODUCT_LIST,
  IGNORE_LIST,
  TIMEOUT,
};
