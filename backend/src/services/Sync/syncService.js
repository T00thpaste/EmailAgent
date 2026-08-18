const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL);
let polling = false;
import emailRepository from "../../repositories/emailRepository.js";
import { getHistory, getInboxEmailById } from "../gmailService.js";

async function syncEmails() {
    if (!emailRepository.isInitialized()) {
        console.log("Cache not initialized yet.");
        return;
    }

    const oldHistoryId = emailRepository.getLatestHistoryId();
    console.log(`Checking Gmail history after ${oldHistoryId}...`);
    const history = await getHistory(oldHistoryId);

    if (!history.history) {
        console.log("No changes detected.");
        return;
    }

    await processHistory(history);
    emailRepository.setLatestHistoryId(history.historyId);
    console.log(`Synchronization complete. New History ID: ${history.historyId}`);
}

export default function startPolling() {
    if(polling) {
        console.log("Polling already running");
        return;
    }

    polling = true;
    pollingLoop();
}

async function pollingLoop() {
    if(!polling) return;

    try {
        await syncEmails();
    } catch (err) {
        console.error("Polling failed:", err);
    }
    
    if(polling) setTimeout(pollingLoop, POLLING_INTERVAL);
}

export function stopPolling() {
    polling = false;
}

async function processHistory(history) {
    for (const record of history.history) {
        if (!record.messagesAdded) continue;

        for (const message of record.messagesAdded) {
            const email = await getInboxEmailById(message.message.id);

            emailRepository.addEmail(email);
        }
    }
}