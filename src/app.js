import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");

app.use(expressLayouts);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Session middleware - remembers logged-in users
app.use(session({
  secret: 'allmymeeples-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/", indexRoutes);
app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).render("index", { title: "Not Found", message: "Page not found." });
});

export default app;
