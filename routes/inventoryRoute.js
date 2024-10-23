const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validation = require("../utilities/classification-validation");
const utilities = require("../utilities");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:detailId", invController.buildByDetailId);
router.get("/", invController.buildByManagement);
router.get("/add-classification", invController.renderAddClassification);

router.post(
  "/add-classification",
  validation.classificationValidationRules(),
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

module.exports = router;
