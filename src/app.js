const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const indexRoutes = require("./routes/index");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");

app.use(expressLayouts);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRoutes);

app.use((req, res) => {
  res.status(404).render("index", { title: "Not Found", message: "Page not found." });
});

module.exports = app;
