import pg from 'pg'
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// DB Config

const pool = new pg.Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.PASSWORD
});

const query = async (text, params) => { // params is an array
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

//pool.end().then(() => console.log('pool has ended'))

export default query;
