import app from "./app.js";
import authRoutes from "./routes/authRoutes.js";
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
