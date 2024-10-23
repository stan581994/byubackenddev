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
  res.render("./inventory/classification", {
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
  res.render("./inventory/classification", {
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
    notice: req.flash("notice"),
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
    console.log("Received classification_name:", classification_name);

    const result = await classificationModel.addClassification(
      classification_name
    );

    if (result) {
      let nav = await utilities.getNav();
      req.flash("notice", "Classification added successfully");
      res.status(201).render("./inv/classification", {
        title: "Add Classification",
        nav,
        grid,
        notice: req.flash("notice")[0],
      });
    } else {
      req.flash("notice", "Classification was not added");
      res.status(501).render("./inv/classification", {
        nav,
        grid,
        notice: req.flash("notice")[0],
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "An error occurred while adding the classification");
    res.status(500).render("./inv/classification", {
      nav: await utilities.getNav(),
      grid: await utilities.buildManagementGrid(),
      notice: req.flash("notice")[0],
    });
  }
}

module.exports = {
  addClassification,
  buildByClassificationId,
  buildByDetailId,
  buildByManagement,
  renderAddClassification,
};
