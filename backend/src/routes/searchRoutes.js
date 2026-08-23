import express from "express";
import { searchEmails } from "../services/searchService.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                error: "Search query is required",
            });
        }

        const results = await searchEmails(q);

        res.json(results);
    } catch (error) {
        console.error("Email search failed:", error);

        res.status(500).json({
            error: "Failed to search emails",
        });
    }
});

export default router;
