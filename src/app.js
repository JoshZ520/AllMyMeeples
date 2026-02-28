import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
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

export default app;
