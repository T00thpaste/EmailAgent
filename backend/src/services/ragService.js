import { searchEmails } from "./searchService.js";
import { generateAnswer } from "./llmService.js";
import { buildEmailPrompt } from "../prompts/emailAssistant.js";

export async function answerQuestion(question) {
    const emails = await searchEmails(question, 5);

    if (emails.length === 0) {
        return {
            answer: "I couldn't find any relevant emails.",
            sources: [],
        };
    }

    const prompt = buildEmailPrompt(question, emails);

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