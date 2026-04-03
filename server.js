import app from "./src/app.js";
import { initDb } from "./src/db/init.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

startServer();
