import { Pool, QueryResult } from "pg";
import { NODE_ENV, DB_NAME, USER_DEV, HOST, PASSWORD, DATABASE_URL } from "../shared/constants";

let pool: Pool;

if (NODE_ENV !== "production") {

  // Use local DB
  pool = new Pool({
    user: USER_DEV,
    host: HOST,
    database: DB_NAME,
    password: PASSWORD,
  });
} else {
  // Use production DB
  pool = new Pool({
    connectionString: DATABASE_URL,
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
    console.log(time, "- executed query", {
      text,
      duration,
      rows: res.rowCount,
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export default query;
