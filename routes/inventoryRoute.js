const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validation = require("../utilities/classification-validation");
const vehicleValidation = require("../utilities/vehicle-validation");
const utilities = require("../utilities");

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:detailId",
  utilities.handleErrors(invController.buildByDetailId)
);
router.get(
  "/",
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildByManagement)
);
router.get(
  "/add-classification",
  utilities.checkAdmin,
  utilities.handleErrors(invController.renderAddClassification)
);
router.get(
  "/add-vehicle",
  utilities.checkAdmin,
  utilities.handleErrors(invController.renderAddVehicle)
);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/edit/:inv_id",
  utilities.checkAdmin,
  utilities.handleErrors(invController.editInventoryForm)
);
router.get(
  "/delete/:inv_id",
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteInventoryForm)
);

router.post(
  "/add-classification",
  utilities.checkAdmin,
  validation.classificationValidationRules(),
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.post(
  "/add-vehicle",
  utilities.checkAdmin,
  vehicleValidation.vehicleValidationRules(),
  vehicleValidation.checkVehicleData,
  utilities.handleErrors(invController.addVehicle)
);

router.post(
  "/update/",
  utilities.checkAdmin,
  utilities.handleErrors(invController.updateInventory)
);

router.post(
  "/delete/",
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;
