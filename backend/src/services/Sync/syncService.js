const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL);

async function syncEmails() {
    console.log("Sync running");
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