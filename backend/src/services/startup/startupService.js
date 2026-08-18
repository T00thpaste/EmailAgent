import emailCache from "../../cache/emailCache.js";
import { getInboxEmails } from "../gmailService.js";

export async function initialize() {
    console.log("Initializing...");

    const { emails, historyId } = await getInboxEmails();

    emailCache.replaceAll(emails);
    emailCache.setLatestHistoryId(historyId);

    console.log(`Cached ${emails.length} emails.`);
    console.log(`Latest History ID: ${historyId}`);
}