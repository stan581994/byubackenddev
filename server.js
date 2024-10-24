const utilities = require("./utilities");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const path = require("path");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const session = require("express-session");
const pool = require("./database/");
const bodyParser = require("body-parser");

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(require("./routes/static"));
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 *
 * Routes
 *************************/

app.use("/inv", require("./routes/inventoryRoute"));
app.get("/trigger-error", (req, res, next) => {
  const error = new Error("Intentional Server Error");
  error.status = 500;
  next(error);
});
app.use("/account", require("./routes/accountRoute"));

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

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
