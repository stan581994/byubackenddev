const pool = require("../database");

async function getClassification() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

module.exports = { getClassification };
