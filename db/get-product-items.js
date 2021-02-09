const query = require('./index.js');
const format = require('pg-format');

const getProductItems = async (req, res) => {
  // console.log('header is', req.header('Product'));
  let queryString = format('SELECT * FROM %I', req.header('Product'));
  const result = await query(queryString);
  res.json(result);
}

module.exports = getProductItems;
