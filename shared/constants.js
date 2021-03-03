const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const PRODUCT_URL = process.env.PRODUCT_URL;
const MANUFACTURER_URL = process.env.MANUFACTURER_URL;

const CACHE_TIMER = process.env.CACHE_TIMER || 300;
const REDIS_URL = process.env.REDIS_URL || null;
const KEY_EVENT_SET = "__keyevent@0__:set";

const CRON_IN_MINUTES = process.env.CRON_IN_MINUTES || 6;
const START_CRON = process.env.START_CRON || null;
const END_CRON = process.env.END_CRON || null;

module.exports = {
  ACCESS_TOKEN_SECRET,
  PRODUCT_URL,
  MANUFACTURER_URL,
  CACHE_TIMER,
  REDIS_URL,
  KEY_EVENT_SET,
  CRON_IN_MINUTES,
  START_CRON,
  END_CRON,
};
