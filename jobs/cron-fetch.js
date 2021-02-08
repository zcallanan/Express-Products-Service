const cron = require('node-cron');
const fetchProducts = require('../api/fetch-products.js');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const cronFetch = () => {
  const task = cron.schedule(`*/${process.env.CRON_IN_MINUTES} * * * *`, () => {
    const products = ['beanies', 'facemasks', 'gloves'];
    products.forEach(product => {
      fetchProducts(product);
    })
  })
}

module.exports = cronFetch;
