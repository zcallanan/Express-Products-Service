import request from 'request';
import fetchProducts from './fetch-products.js'

const appV2 = (req, res) => {

  const products = ['beanies', 'facemasks', 'gloves'];
  Object.freeze(products);
  let manufacturers;
  // Get products for that url
  products.forEach(product => {
    manufacturers = fetchProducts(product); // Will be run by a job to pull product data every minute
    // Then fetch data for each manufacturer of that product
  })
  console.log(manufacturers)
}

export default appV2;
