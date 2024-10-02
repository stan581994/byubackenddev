const e = require("express");
const invModel = require("../models/inventory-model");
const Util = {};

Util.getNav = async function () {
  // Example implementation
  let data = await invModel.getClassification();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page"> Home </a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type' +
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

module.exports = Util;
