const { Pool } = require("pg");
const dotenv = require("dotenv");
const { NODE_ENV } = require("../shared/constants.js");
let pool;

if (NODE_ENV !== "production") {
  dotenv.config();

  const dbName =
    NODE_ENV === "test"
      ? process.env.DATABASE_NAME_TEST
      : process.env.DATABASE_NAME;

  // Use local DB
  pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: dbName,
    password: process.env.PASSWORD,
  });
} else {
  // Use production DB
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

const query = async (text, params) => {
  try {
    // params is an array
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    let today = new Date();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time, "- executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.log(err);
  }
};

module.exports = query;
