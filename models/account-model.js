const pool = require("../database");

/* *****************************
 *   Register new account
 * *************************** */

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  address
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password,address) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
      address,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, address, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Check account using id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, address, account_type FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}

async function updateAccount(
  account_id,
  account_email,
  account_firstname,
  account_lastname,
  address
) {
  try {
    const sql =
      "UPDATE account SET account_email = $1, account_firstname = $2, account_lastname = $3, address = $4 WHERE account_id = $5 RETURNING *";
    const data = await pool.query(sql, [
      account_email,
      account_firstname,
      account_lastname,
      address,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    return error.message;
  }
}

async function updateAccountPassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_password, account_id]);
    return data.rows[0];
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updateAccountPassword,
};
