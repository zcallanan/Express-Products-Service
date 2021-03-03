const fetchProducts = require("../api/fetch-products.js");

const products = ["beanies", "facemasks", "gloves"];
products.forEach((product, index) =>
  setTimeout(fetchProducts, 5000 * index, product)
);
