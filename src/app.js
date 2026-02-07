const express = require("express");
const path = require("path");
const indexRoutes = require("./routes/index");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRoutes);

app.use((req, res) => {
  res.status(404).render("index", { title: "Not Found", message: "Page not found." });
});

module.exports = app;
