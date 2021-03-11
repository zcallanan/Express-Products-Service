import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

export const NODE_ENV: string | undefined = process.env.NODE_ENV;
export const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
export const PORT: number = Number(process.env.PORT) || 3010;

export const PRODUCT_URL: string | undefined = process.env.PRODUCT_URL;
export const MANUFACTURER_URL: string | undefined = process.env.MANUFACTURER_URL;

export const CACHE_TIMER: number = Number(process.env.CACHE_TIMER) || 300;
export const TEST_CACHE_TIMER: number = Number(process.env.TEST_CACHE_TIMER) || 60;
export const REDIS_URL: string | undefined = process.env.REDIS_URL || undefined;

export const CRON_IN_MINUTES: number = Number(process.env.CRON_IN_MINUTES) || 6;
export const START_CRON: number | undefined = Number(process.env.START_CRON) || undefined;
export const END_CRON: number | undefined = Number(process.env.END_CRON) || undefined;
export const TIMEOUT = Number(process.env.TIMEOUT);

export const KEY_EVENT_SET = "__keyevent@0__:set";
export const PRODUCT_LIST: string[] = ["beanies", "facemasks", "gloves"];
export const IGNORE_LIST: string[] = [
  "manufacturer-list",
  "beanies",
  "facemasks",
  "gloves",
  "beanies_test",
  "facemasks_test",
  "gloves_test",
];

// export {
//   NODE_ENV,
//   ACCESS_TOKEN_SECRET,
//   PORT,
//   PRODUCT_URL,
//   MANUFACTURER_URL,
//   CACHE_TIMER,
//   TEST_CACHE_TIMER,
//   REDIS_URL,
//   KEY_EVENT_SET,
//   CRON_IN_MINUTES,
//   START_CRON,
//   END_CRON,
//   PRODUCT_LIST,
//   IGNORE_LIST,
//   TIMEOUT,
// };
