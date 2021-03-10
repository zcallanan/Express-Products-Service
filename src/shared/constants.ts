import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

const NODE_ENV: string | undefined = process.env.NODE_ENV;
const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
const PORT: number = Number(process.env.PORT) || 3010;

const PRODUCT_URL: string | undefined = process.env.PRODUCT_URL;
const MANUFACTURER_URL: string | undefined = process.env.MANUFACTURER_URL;

const CACHE_TIMER: number = Number(process.env.CACHE_TIMER) || 300;
const TEST_CACHE_TIMER: number = Number(process.env.TEST_CACHE_TIMER) || 60;
const REDIS_URL: string | undefined = process.env.REDIS_URL || undefined;

const CRON_IN_MINUTES: number = Number(process.env.CRON_IN_MINUTES) || 6;
const START_CRON: number | undefined = Number(process.env.START_CRON) || undefined;
const END_CRON: number | undefined = Number(process.env.END_CRON) || undefined;
const TIMEOUT = Number(process.env.TIMEOUT);

const KEY_EVENT_SET = "__keyevent@0__:set";
const PRODUCT_LIST: Array<string> = ["beanies", "facemasks", "gloves"];
const IGNORE_LIST: Array<string> = [
  "manufacturer-list",
  "beanies",
  "facemasks",
  "gloves",
  "beanies_test",
  "facemasks_test",
  "gloves_test",
];

export {
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
