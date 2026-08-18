const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL);
import emailCache from "../../cache/emailCache.js";
import { getHistory, getInboxEmailById } from "../gmailService.js";

async function syncEmails() {
    if (!emailCache.isInitialized()) {
        console.log("Cache not initialized yet.");
        return;
    }

    const oldHistoryId = emailCache.getLatestHistoryId();

    console.log(`Checking Gmail history after ${oldHistoryId}...`);

    const history = await getHistory(oldHistoryId);

    if (!history.history) {
        console.log("No changes detected.");
        return;
    }

    for (const record of history.history) {
        if (!record.messagesAdded) continue;

        for (const message of record.messagesAdded) {
            const email = await getInboxEmailById(message.message.id);

            emailCache.addEmail(email);
        }
    }

    emailCache.setLatestHistoryId(history.historyId);

    console.log(`Synchronization complete. New History ID: ${history.historyId}`);
}

export default function startPolling() {
    pollingLoop();
}

async function pollingLoop() {
    try {
        await syncEmails();
    } catch (err) {
        console.error("Polling failed:", err);
    }
    
    setTimeout(pollingLoop, POLLING_INTERVAL);
}