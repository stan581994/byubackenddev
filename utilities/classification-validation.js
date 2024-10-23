const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

validate.classificationValidationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      ),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inv/add-classification", {
      errors: errors.array(),
      title: "Management View",
      nav,
      classification_name: req.body.classificationName,
    });
    return;
  }
  next();
};

module.exports = validate;
