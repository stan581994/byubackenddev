const utilities = require("./utilities");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const path = require("path");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(require("./routes/static"));
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/inv", inventoryRoute);

app.get("/trigger-error", (req, res, next) => {
  const error = new Error("Intentional Server Error");
  error.status = 500;
  next(error);
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status === 500) {
    res.status(err.status || 500);
    res.render("errors/500_error", {
      title: err.status || "500 Server Error",
      message: err.message,
      nav,
    });
  } else {
    res.status(err.status || 404);
    res.render("errors/error", {
      title: err.status || "404 Server Error",
      message: err.message,
      nav,
    });
  }
});
