const { Pool } = require("pg");
const dotenv = require("dotenv");
let pool;

if (process.env.NODE_ENV !== "production") {
  dotenv.config();

  const dbName =
    process.env.NODE_ENV === "test"
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

// DB Config
let today;
let time;

const query = async (text, params) => {
  try {
    // params is an array
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    today = new Date();
    time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time);
    return res;
  } catch (err) {
    console.log(err);
  }
};

// export default query;
module.exports = query;
