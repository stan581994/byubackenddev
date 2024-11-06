const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
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

async function buildEditAccount(req, res, next) {
  const account_id = req.params.accountId;
  try {
    const data = await accountModel.getAccountById(account_id);
    if (data.length === 0) {
      let nav = await utilities.getNav();
      return res.render("/account/", {
        title: "Account Management",
        nav,
        notice: "No account found.",
      });
    } else {
      let nav = await utilities.getNav();
      return res.render("account/update", {
        title: "Update Account",
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_address: data.address,
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.log(error);
  }

  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    address,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
    return;
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
    address
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations! You're registered ${account_firstname}. Please login`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice")[0],
    });
  } else {
    req.flash("notice", "Registration failed. Please try again.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      notice: req.flash("notice")[0],
    });
  }
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice")[0],
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        notice: req.flash("notice")[0],
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function buildByAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountMgmt", {
    title: "Account Management View",
    account_id: res.locals.account_id,
    nav,
    notice: null,
  });
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/account/login");
}

/* ***************************
 *  Update Inventory Data
 * ************************** */

async function updateAccount(req, res, next) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    address,
  } = req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_email,
    account_firstname,
    account_lastname,
    address
  );
  if (updateResult) {
    let nav = await utilities.getNav();
    res.locals.account_firstname = account_firstname;
    res.status(201).render("account/accountMgmt", {
      title: "Account Management",
      account_id: res.locals.account_id,
      nav,
      notice: "Account updated successfully.",
    });
  } else {
    res.status(500).render(`account/edit/${account_id}`, {
      title: "Account Management",
      nav,
      account_id: account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      notice: "Account update failed.",
    });
  }
}

async function updateAccountPassword(req, res, next) {
  const { account_id, account_password } = req.body;
  const hashedPassword = await bcrypt.hashSync(account_password, 10);
  const updateResult = await accountModel.updateAccountPassword(
    account_id,
    hashedPassword
  );
  if (updateResult) {
    let nav = await utilities.getNav();
    res.status(201).render("account/accountMgmt", {
      title: "Account Management",
      account_id: res.locals.account_id,
      nav,
      notice: "Account password updated successfully.",
    });
  } else {
    res.status(500).render(`account/edit/${account_id}`, {
      title: "Account Management",
      account_id: res.locals.account_id,
      nav,
      notice: "Account update failed.",
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildEditAccount,
  registerAccount,
  accountLogin,
  buildByAccountManagement,
  updateAccount,
  updateAccountPassword,
  logout,
};
