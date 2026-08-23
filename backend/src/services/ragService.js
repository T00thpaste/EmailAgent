import { searchEmails } from "./searchService.js";
import { generateAnswer } from "./llmService.js";
import { buildEmailPrompt } from "../prompts/emailAssistant.js";

function buildSearchQuery(question, history) {
    if (!history || history.length === 0) return question;

    // Follow-ups like "what about the second one" carry no topical
    // keywords of their own, so the embedding search needs recent user
    // turns folded in or it retrieves unrelated emails.
    const recentUserTurns = history
        .filter((turn) => turn.role === "user")
        .slice(-2)
        .map((turn) => turn.content);

    return [...recentUserTurns, question].join(" ");
}

export async function answerQuestion(question, history = []) {
    const searchQuery = buildSearchQuery(question, history);
    const emails = await searchEmails(searchQuery, 5);

    if (emails.length === 0) {
        return {
            answer: "I couldn't find any relevant emails.",
            sources: [],
        };
    }

    const prompt = buildEmailPrompt(question, emails, history);

    const answer = await generateAnswer(prompt);

    return {
        answer,
        sources: emails.map((email) => ({
            id: email.id,
            subject: email.subject,
            sender_name: email.sender_name,
            sender_email: email.sender_email,
            received_at: email.received_at,
            similarity: email.similarity,
        })),
    };
}