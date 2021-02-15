const fetchProducts = require('../api/fetch-products.js');

const products = ['beanies', 'facemasks', 'gloves'];
products.forEach(product => {fetchProducts(product)})
