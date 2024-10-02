const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("excecuted  query", { text });
        return res;
      } catch (err) {
        console.error("error in query", { text });
        throw err;
      }
    },
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  module.exports = pool;
}
