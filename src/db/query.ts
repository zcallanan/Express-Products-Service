import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";
import { NODE_ENV } from "../shared/constants";

let pool: Pool;

if (NODE_ENV !== "production") {
  dotenv.config();

  const dbName: string | undefined =
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

const query = async (text: string): Promise<QueryResult> => {
  try {
    const start = Date.now();
    const res = await pool.query(text);
    const duration = Date.now() - start;
    const today: Date = new Date();
    const time: string =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time, "- executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export default query;
