const query = require('../db/index.js');
const format = require('pg-format');

const queryP = async (string) => {
  return await query(string);
}

const getProductItems = async (req, res, next) => {
  console.log('header is', req.header('Product'))
  let queryString = format('SELECT * FROM %I', req.header('Product'));
  const result = await query(queryString)
  res.json(result);
  next()
}

module.exports = getProductItems;
