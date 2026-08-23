import express from "express";
import cors from "cors";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});

app.use("/api/search", searchRoutes);

export default app;
