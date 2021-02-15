const cron = require('node-cron');
const fetchProducts = require('../api/fetch-products.js');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const task = cron.schedule(`*/${process.env.CRON_IN_MINUTES} * * * *`, () => {
  const products = ['beanies', 'facemasks', 'gloves'];
  products.forEach(product => {
    fetchProducts(product);
  })
}, {
  scheduled: false
})

const cronFetch = () => {
  if (process.env.START_CRON) {
    console.log('start cron');
    task.start();
  }
  if (process.env.END_CRON) {
    console.log('end cron');
    task.end();
  }
}



module.exports = cronFetch;
