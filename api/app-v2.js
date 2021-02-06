import request from 'request';
import fetchProducts from './fetch-products.js'

const appV2 = (req, res) => {

  const products = ['beanies', 'facemasks', 'gloves'];
  Object.freeze(products);
  let manufacturers;
  // Get products for that url
  products.forEach(product => {
    fetchProducts(product); // Will be run by a job to pull product data every minute
  })
}

export default appV2;
