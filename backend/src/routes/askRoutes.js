import express from "express";
import { answerQuestion } from "../services/ragService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { question, history } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required",
            });
        }

        const recentHistory = Array.isArray(history)
            ? history
                .slice(-6)
                .filter((turn) => turn && typeof turn.content === "string")
                .map((turn) => ({
                    role: turn.role === "user" ? "user" : "assistant",
                    content: turn.content,
                }))
            : [];

        const result = await answerQuestion(question, recentHistory);

        res.json(result);
    } catch (error) {
        console.error("Question answering failed:", error);

        res.status(500).json({
            error: "Failed to answer question",
        });
    }
});

export default router;