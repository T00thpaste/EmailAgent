import express from "express";
import { answerQuestion } from "../services/ragService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required",
            });
        }

        const result = await answerQuestion(question);

        res.json(result);
    } catch (error) {
        console.error("Question answering failed:", error);

        res.status(500).json({
            error: "Failed to answer question",
        });
    }
});

export default router;