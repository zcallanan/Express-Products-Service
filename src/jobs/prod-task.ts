import fetchProductData from "../fetch/fetch-products";
import subscriberInit from "../shared/subscriber-init";
import { PRODUCT_LIST, TIMEOUT } from "../shared/constants";

subscriberInit();

PRODUCT_LIST.forEach((product, index) =>
  setTimeout(fetchProductData, 5000 * index, product)
);

// Kill script if it hasn't killed itself
setTimeout(() => {
  console.log("timeout");
  return process.exit(22);
}, TIMEOUT);
