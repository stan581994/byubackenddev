const invModel = require("../models/inventory-model");
const classificationModel = require("../models/classification-model");
const utilities = require("../utilities/");

/*  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (data.length === 0) {
      let nav = await utilities.getNav();
      return res.render("./inv/classification", {
        title: "No vehicles found",
        nav,
        grid: "<p>No vehicles added in this classification.</p>",
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inv/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error fetching inventory by classification:", error);
    res.status(500).send("Internal Server Error");
  }
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
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inv/management", {
    title: "Management View",
    nav,
    grid,
    classificationSelect,
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
      const classificationSelect = await utilities.buildClassificationList();
      res.status(201).render("./inv/management", {
        title: "Vehicle Management",
        nav,
        grid,
        classificationSelect,
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
      const classificationSelect = await utilities.buildClassificationList();
      req.flash("notice", "Vehicle added successfully");
      res.status(201).render("./inv/management", {
        title: "Add Classification",
        nav,
        grid,
        classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
}

async function editInventoryForm(req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const invData = await invModel.getInventoryById(inv_id);
    if (invData.length === 0) {
      return next(new Error("No data returned"));
    }

    const classificationSelect = await utilities.buildClassificationList(
      invData[0].classification_id
    );
    const nav = await utilities.getNav();

    console.log("=====" + invData[0].inv_description); // Log the inv_id for debugging

    res.render("./inv/edit-inventory", {
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      title: "Edit " + invData[0].inv_make + " " + invData[0].inv_model,
      invData: invData[0], // Pass the first item in the array
      inv_id: invData[0].inv_id,
      inv_make: invData[0].inv_make,
      inv_model: invData[0].inv_model,
      inv_year: invData[0].inv_year,
      inv_description: invData[0].inv_description,
      inv_image: invData[0].inv_image,
      inv_thumbnail: invData[0].inv_thumbnail,
      inv_price: invData[0].inv_price,
      inv_miles: invData[0].inv_miles,
      inv_color: invData[0].inv_color,
      classification_id: invData[0].classification_id,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    next(error);
  }
}

async function deleteInventoryForm(req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const invData = await invModel.getInventoryById(inv_id);
    if (invData.length === 0) {
      return next(new Error("No data returned"));
    }

    const classificationSelect = await utilities.buildClassificationList(
      invData[0].classification_id
    );
    const nav = await utilities.getNav();
    res.render("./inv/delete-inventory", {
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      title: "Delete " + invData[0].inv_make + " " + invData[0].inv_model,
      invData: invData[0], // Pass the first item in the array
      inv_id: invData[0].inv_id,
      inv_make: invData[0].inv_make,
      inv_model: invData[0].inv_model,
      inv_year: invData[0].inv_year,
      inv_price: invData[0].inv_price,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    next(error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    const nav = await utilities.getNav();
    const grid = await utilities.buildManagementGrid();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.status(201).render("./inv/management", {
      title: "Vehicle Management",
      nav,
      grid,
      classificationSelect,
      notice: req.flash("notice")[0],
    });
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventoryItem(req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);
  if (deleteResult) {
    const nav = await utilities.getNav();
    const grid = await utilities.buildManagementGrid();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", `The item was successfully deleted.`);
    res.status(201).render("./inv/management", {
      title: "Vehicle Management",
      nav,
      grid,
      classificationSelect,
      notice: req.flash("notice")[0],
    });
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("./inv/delete-inventory", {
      title: "Delete Vehicle",
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
  getInventoryJSON,
  editInventoryForm,
  updateInventory,
  deleteInventoryForm,
  deleteInventoryItem,
};
