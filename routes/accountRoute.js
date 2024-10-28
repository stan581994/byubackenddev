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
  utilities.handleErrors(accountController.buildByAccountManagement)
);

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

module.exports = router;
