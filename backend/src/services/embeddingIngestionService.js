import emailRepository from "../repositories/emailRepository.js";
import { generateEmbedding } from "./embeddingService.js";

function formatEmailForEmbedding(email) {
        return `
    Subject: ${email.subject ?? ""}
    From: ${email.sender_name ?? ""} <${email.sender_email ?? ""}>
    Date: ${email.received_at ?? ""}

    ${email.body_plain_text ?? email.snippet ?? ""}
    `;
}

export async function embedAllEmails() {
    const emails = await emailRepository.getAll();

    console.log(`Starting embedding for ${emails.length} emails...`);

    let completed = 0;
    let failed = 0;

    for (const email of emails) {
        try {
            const text = formatEmailForEmbedding(email);

            const embedding = await generateEmbedding(text);

            await emailRepository.saveEmbedding(
                email.id,
                embedding
            );

            completed++;

            console.log(
                `Embedded ${completed}/${emails.length}: ${email.subject ?? email.id}`
            );
        } catch (error) {
            failed++;

            console.error(
                `Failed to embed ${email.id} (${email.subject ?? "No subject"})`
            );

            console.error(error.message);
        }
    }

    console.log("\nEmbedding ingestion complete.");
    console.log(`Successful: ${completed}`);
    console.log(`Failed: ${failed}`);
}