import "dotenv/config";
import app from "./app.js";
import authRoutes from "./routes/authRoutes.js";
import startPolling from "./services/Sync/syncService.js"
import { initialize } from "./services/startup/startupService.js";
import pool from "./config/database.js";

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
    await initialize();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        startPolling();
    });
}

const result = await pool.query("SELECT NOW()");
console.log("Database connected:", result.rows[0]);

startServer();
