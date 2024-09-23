const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const path = require("path");

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(require("./routes/static"));
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
