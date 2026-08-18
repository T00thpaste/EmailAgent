import emailRepository from "../../repositories/emailRepository.js";
import { getInboxEmails } from "../gmailService.js";

export async function initialize() {
    console.log("Initializing...");

    const { emails, historyId } = await getInboxEmails();

    emailRepository.replaceAll(emails);
    emailRepository.setLatestHistoryId(historyId);

    console.log(`Cached ${emails.length} emails.`);
    console.log(`Latest History ID: ${historyId}`);
}