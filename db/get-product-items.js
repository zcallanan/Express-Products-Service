const query = require('../db/index.js');
const format = require('pg-format');

const getProductItems = (req, res) => {
  console.log('header is', req.header('Product'))
  let queryString = format('SELECT * FROM %I', req.header('Product'));
  query(queryString, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = getProductItems;
