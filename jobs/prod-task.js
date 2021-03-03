const fetchProducts = require("../api/fetch-products.js");
const subscriberInit = require("../shared/subscriber-init.js");

subscriberInit();

const products = ["beanies", "facemasks", "gloves"];
products.forEach((product, index) =>
  setTimeout(fetchProducts, 5000 * index, product)
);

// Kill script if it hasn't killed itself
setTimeout(() => {
  console.log("timeout");
  return process.exit(22);
}, 120000);
