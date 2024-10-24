const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validation = require("../utilities/classification-validation");
const vehicleValidation = require("../utilities/vehicle-validation");
const utilities = require("../utilities");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:detailId", invController.buildByDetailId);
router.get("/", invController.buildByManagement);
router.get("/add-classification", invController.renderAddClassification);
router.get("/add-vehicle", invController.renderAddVehicle);

router.post(
  "/add-classification",
  validation.classificationValidationRules(),
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.post(
  "/add-vehicle",
  vehicleValidation.vehicleValidationRules(),
  vehicleValidation.checkVehicleData,
  utilities.handleErrors(invController.addVehicle)
);
module.exports = router;
