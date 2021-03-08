const cron = require("node-cron");
const fetchProductData = require("../fetch/fetch-products.js");
const {
  CRON_IN_MINUTES,
  START_CRON,
  END_CRON,
  PRODUCT_LIST,
} = require("../shared/constants.js");

const task = cron.schedule(
  `*/${CRON_IN_MINUTES} * * * *`,
  () => {
    PRODUCT_LIST.forEach((product, index) =>
      setTimeout(fetchProductData, 5000 * index, product)
    );
  },
  {
    scheduled: false,
  }
);

const cronFetch = () => {
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
