import emailCache from "../../cache/emailCache.js";
import { getInboxEmails } from "../gmailService.js";

export async function initialize() {
    console.log("Initializing...");
    const emails = await getInboxEmails();
    emailCache.replaceAll(emails);
    console.log(`Cached ${emails.length} emails.`);
}