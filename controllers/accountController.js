const utilities = require("../utilities");
const accountModel = require("../models/account-model");

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations! You\'re registered ${account_firstname}. Please login`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice")[0],
    });
  } else {
    req.flash("notice", "Registration failed. Please try again.");
    res.status(501).render("/account/register", {
      title: "Register",
      nav,
      notice: req.flash("notice")[0],
    });
  }
}
module.exports = { buildLogin, buildRegister, registerAccount };
