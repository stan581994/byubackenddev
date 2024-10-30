//Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities");
const regValidation = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildByAccountManagement)
);

router.get(
  "/edit/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount)
);

router.get("/logout", utilities.handleErrors(accountController.logout));

router.post(
  "/register",
  regValidation.registrationRules(),
  regValidation.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidation.loginRules(),
  regValidation.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.post(
  "/edit",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/editpassword",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountPassword)
);

module.exports = router;
