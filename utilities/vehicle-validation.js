const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

validate.vehicleValidationRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),
    body("inv_description")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long."),
    body("inv_image")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Image URL must be at least 3 characters long."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Thumbnail URL must be at least 3 characters long."),
    body("inv_price")
      .trim()
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("Price must be a number or decimal."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .matches(/^\d{4}$/)
      .withMessage("Year must be 4 digits long."),
    body("inv_miles")
      .trim()
      .matches(/^\d+$/)
      .withMessage("Miles must be a digit."),
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long."),
  ];
};

validate.checkVehicleData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationDropDown = await utilities.buildClassificationList();
    res.render("inv/add-vehicle", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationDropDown,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  } else {
    next();
  }
};

module.exports = validate;
