import { generateEmbedding } from "./embeddingService.js";
import emailRepository from "../repositories/emailRepository.js";

export async function searchEmails(query, limit = 10) {
    const queryEmbedding = await generateEmbedding(query);

    return emailRepository.searchByEmbedding(
        queryEmbedding,
        limit
    );
}