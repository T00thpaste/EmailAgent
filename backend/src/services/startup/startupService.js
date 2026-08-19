import emailRepository from "../../repositories/emailRepository.js";
import { getInboxEmails } from "../gmailService.js";

export async function initialize() {
    console.log("Initializing...");

    const { emails, historyId } = await getInboxEmails();

    await emailRepository.replaceAll(emails, historyId);

    console.log(`Cached ${emails.length} emails.`);
    console.log(`Latest History ID: ${historyId}`);
}