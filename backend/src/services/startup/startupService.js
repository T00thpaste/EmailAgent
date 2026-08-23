import emailRepository from "../../repositories/emailRepository.js";
import { getInboxEmails } from "../gmailService.js";
import emailCache from "../../cache/emailCache.js";

export async function initialize() {
    console.log("Initializing...");

    const { emails, historyId } = await getInboxEmails();
    await emailRepository.replaceAll(emails, historyId);
    emailCache.replaceAll(emails.slice(0,50));

    console.log(`Initialized DB with ${emails.length} emails.`);
    console.log(`Initialized cache with latest 50 emails`);
    console.log(`Latest History ID: ${historyId}`);
}