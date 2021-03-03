const cron = require("node-cron");
const fetchProducts = require("../api/fetch-products.js");
const {
  CRON_IN_MINUTES,
  START_CRON,
  END_CRON,
} = require("../shared/constants.js");

const task = cron.schedule(
  `*/${CRON_IN_MINUTES} * * * *`,
  () => {
    const products = ["beanies", "facemasks", "gloves"];
    products.forEach((product, index) =>
      setTimeout(fetchProducts, 5000 * index, product)
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
