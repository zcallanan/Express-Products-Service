const { Pool } = require('pg');
const dotenv = require('dotenv');
let pool;

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();

  // Use local DB
  pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD
  });
} else {
  // Use production DB
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// DB Config

const query = async (text, params) => { // params is an array
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

//pool.end().then(() => console.log('pool has ended'))

// export default query;
module.exports = query;
