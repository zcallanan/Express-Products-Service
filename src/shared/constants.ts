import dotenv from "dotenv";

// eslint-disable-next-line prefer-destructuring
export const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== "production") dotenv.config();

// Server
// eslint-disable-next-line prefer-destructuring
export const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
export const PORT: number = Number(process.env.PORT) || 3010;

// Third party APIs
// eslint-disable-next-line prefer-destructuring
export const PRODUCT_URL: string | undefined = process.env.PRODUCT_URL;
// eslint-disable-next-line prefer-destructuring
export const MANUFACTURER_URL: string | undefined = process.env.MANUFACTURER_URL;

// Database
export const DB_NAME: string | undefined = NODE_ENV === "test"
  ? process.env.DATABASE_NAME_TEST
  : process.env.DATABASE_NAME;
export const USER_DEV: string | undefined = process.env.USER;
// eslint-disable-next-line prefer-destructuring
export const HOST: string | undefined = process.env.HOST;
// eslint-disable-next-line prefer-destructuring
export const PASSWORD: string | undefined = process.env.PASSWORD;
// eslint-disable-next-line prefer-destructuring
export const DATABASE_URL: string | undefined = process.env.DATABASE_URL;

// Redis values
export const CACHE_TIMER: number = Number(process.env.CACHE_TIMER) || 120;
export const TEST_CACHE_TIMER: number = Number(process.env.TEST_CACHE_TIMER) || 60;
export const REDIS_URL: string | undefined = process.env.REDIS_URL || undefined;

// Timing
export const CRON_IN_MINUTES: number = Number(process.env.CRON_IN_MINUTES) || 6;
export const START_CRON: number | undefined = Number(process.env.START_CRON) || undefined;
export const END_CRON: number | undefined = Number(process.env.END_CRON) || undefined;
export const TIMEOUT = Number(process.env.TIMEOUT);

// Strings & lists
export const KEY_EVENT_SET = "__keyevent@0__:set";
export const PRODUCT_LIST: string[] = ["beanies", "facemasks", "gloves"];
export const IGNORE_LIST: string[] = [
  "manufacturer-list",
  "manufacturer-list_test",
  "beanies",
  "facemasks",
  "gloves",
  "beanies_test",
  "facemasks_test",
  "gloves_test",
  "beanies-inserts",
  "facemasks-inserts",
  "gloves-inserts",
];
