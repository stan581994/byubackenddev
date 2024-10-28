const e = require("express");
const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

Util.getNav = async function () {
  // Example implementation
  let data = await invModel.getClassification();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page"> Home </a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a></li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the inventory details view HTML
 * ************************************ */
Util.buildInventoryDetails = async function (data) {
  let grid;
  if (data.length > 0) {
    const vehicle = data[0];
    grid = '<div id="inv-details">';

    // Image section
    grid += `
      <div class="image-container">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
      </div>`;

    // Details section
    grid += `
      <div class="details-container">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${
      vehicle.inv_model
    }'s Details</h1>
        <hr>
        <p class="price"><strong>Price:</strong> $${new Intl.NumberFormat(
          "en-US"
        ).format(vehicle.inv_price)}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(
          vehicle.inv_miles
        )}</p>
      </div>`;

    grid += "</div>";
  } else {
    grid =
      '<p class="notice">Sorry, no details available for this vehicle.</p>';
  }
  return grid;
};

/* **************************************
 * Build the Management Inventory details view HTML
 * ************************************ */
Util.buildManagementGrid = async function () {
  let grid = `
    <div class="management-container">
      <h1>Vehicle Management</h1>
      <hr>
      <!-- Links to add new classification and inventory -->
      <ul>
          <li><a href="/inv/add-classification">Add New Classification</a></li>
          <li><a href="/inv/add-vehicle">Add New Vehicle</a></li>
      </ul>
    </div>
  `;
  return grid;
};

// Middleware to handle errors in async route handlers
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    res.status(500).send("Internal Server Error");
  });
};

// Drop down for Classification
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassification();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = async (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    let nav = await Util.getNav();
    req.flash("notice", "Please log in.");
    res.render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice")[0],
    });
  }
};

module.exports = Util;
