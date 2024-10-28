const invModel = require("../models/inventory-model");
const classificationModel = require("../models/classification-model");
const utilities = require("../utilities/");
/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inv/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
}

/* ***************************
 *  Build inventory ite by detail_id view
 * ************************** */
async function buildByDetailId(req, res, next) {
  const detail_id = req.params.detailId;
  const data = await invModel.getDetailInventoryByInventoryId(detail_id);
  console.log(data);
  const grid = await utilities.buildInventoryDetails(data);
  let nav = await utilities.getNav();
  const className =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inv/classification", {
    title: className,
    nav,
    grid,
  });
}

/* ***************************
 *  Build inventory by Management view
 * ************************** */

async function buildByManagement(req, res, next) {
  const grid = await utilities.buildManagementGrid();
  let nav = await utilities.getNav();
  res.render("./inv/management", {
    title: "Management View",
    nav,
    grid,
    notice: null,
  });
}

/* ***************************
 *  Build inventory by Classification view
 * ************************** */

async function renderAddClassification(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inv/add-classification", {
    title: "Add Classification",
    nav,
  });
}

/* ***************************
 *  Process adding Classification Object
 * ************************** */

async function addClassification(req, res, next) {
  try {
    const grid = await utilities.buildManagementGrid();
    const { classification_name } = req.body;

    const result = await classificationModel.addClassification(
      classification_name
    );

    if (result) {
      let nav = await utilities.getNav();
      req.flash("notice", "Classification added successfully");
      res.status(201).render("./inv/management", {
        title: "Vehicle Management",
        nav,
        grid,
        notice: req.flash("notice")[0],
      });
    } else {
      req.flash("notice", "Classification was not added");
      res.status(501).render("./inv/add-classification", {
        nav,
        grid,
        notice: req.flash("notice")[0],
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "An error occurred while adding the classification");
    res.status(500).render("./inv/add-classification", {
      nav: await utilities.getNav(),
      grid: await utilities.buildManagementGrid(),
      notice: req.flash("notice")[0],
    });
  }
}

async function renderAddVehicle(req, res, next) {
  let nav = await utilities.getNav();
  let classificationDropDown = await utilities.buildClassificationList();
  res.render("./inv/add-vehicle", {
    title: "Add Vehicle",
    errors: null,
    classificationDropDown,
    nav,
  });
}

async function addVehicle(req, res, next) {
  let nav = await utilities.getNav();
  let grid = await utilities.buildManagementGrid();
  const {
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
  } = req.body;

  try {
    const vehResult = await invModel.addVehicle(
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
    );

    if (vehResult) {
      req.flash("notice", "Vehicle added successfully");
      res.status(201).render("./inv/management", {
        title: "Add Classification",
        nav,
        grid,
        notice: req.flash("notice")[0],
      });
    } else {
      req.flash("notice", "Failed to add vehicle");
      res.status(500).render("./inv/add-vehicle", {
        title: "Add Vehicle",
        nav,
        errors: null,
        notice: req.flash("notice")[0],
      });
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    req.flash("notice", "Failed to add vehicle due to an internal error");
    res.status(500).render("./inv/add-vehicle", {
      title: "Add Vehicle",
      nav,
      errors: null,
      notice: req.flash("notice")[0],
    });
  }
}

module.exports = {
  addVehicle,
  addClassification,
  buildByClassificationId,
  buildByDetailId,
  buildByManagement,
  renderAddClassification,
  renderAddVehicle,
};
