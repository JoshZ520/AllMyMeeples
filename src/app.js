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

// 404 handler - must come after all routes
app.use((req, res) => {
  res.status(404).render("index", { title: "Not Found", message: "Page not found." });
});

// Global error handler - must come last, after 404
app.use((err, req, res, next) => {
  // Log error for debugging (but don't expose details to users)
  console.error('Error occurred:', err);

  // Set status code
  const statusCode = err.status || err.statusCode || 500;
  
  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const errorMessage = isDevelopment ? err.message : 'Something went wrong. Please try again.';

  // Check if it's an API request (JSON expected)
  if (req.path.startsWith('/api/')) {
    return res.status(statusCode).json({
      error: errorMessage,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Render error page for regular requests
  res.status(statusCode).render("error", {
    title: "Error",
    message: errorMessage
  });
});

export default app;
