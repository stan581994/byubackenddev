const pool = require("../database");
const { getNav } = require("../utilities");

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

/* ***************************
 *  Add Vehicle
 * ************************** */

async function addVehicle(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `INSERT INTO public.inventory 
    (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ];
    return await pool.query(sql, values);
  } catch (error) {
    console.error("Error executing query:", error);
    return error.message;
  }
}

module.exports = {
  addVehicle,
  getClassification,
  getNav,
  getInventoryByClassificationId,
  getDetailInventoryByInventoryId,
};
