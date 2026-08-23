import express from "express";
import cors from "cors";
import searchRoutes from "./routes/searchRoutes.js";
import askRoutes from "./routes/askRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});

app.use("/api/search", searchRoutes);
app.use("/api/ask", askRoutes);

export default app;
