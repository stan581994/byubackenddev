const pool = require("../database");

async function getClassification() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

module.exports = { getClassification, getInventoryByClassificationId };

/* ***************************
 *  Get an inventory item and its detail by detail_id
 * ************************** */
async function getDetailInventoryByInventoryId(detail_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [detail_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getDetailInventoryByInventoryId error " + error);
  }
}

module.exports = {
  getClassification,
  getInventoryByClassificationId,
  getDetailInventoryByInventoryId,
};
