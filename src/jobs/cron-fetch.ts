import cron from "node-cron";
import fetchProductData from "../fetch/fetch-products";
import {
  CRON_IN_MINUTES,
  START_CRON,
  END_CRON,
  PRODUCT_LIST,
} from "../shared/constants";

const task = cron.schedule(
  `*/${CRON_IN_MINUTES} * * * *`,
  () => {
    PRODUCT_LIST.forEach((product, index) => setTimeout(fetchProductData, 5000 * index, product));
  }, {
    scheduled: false,
  },
);

const cronFetch = (): void => {
  if (START_CRON) {
    console.log("start cron");
    task.start();
  }
  if (END_CRON) {
    console.log("end cron");
    task.end();
  }
};

export default cronFetch;
