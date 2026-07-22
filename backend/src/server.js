import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

import authRoutes from "./routes/redirection.js";

app.use("/auth", authRoutes);
