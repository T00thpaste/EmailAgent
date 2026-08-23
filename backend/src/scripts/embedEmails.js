import "dotenv/config";
import { embedAllEmails } from "../services/embeddingIngestionService.js";

embedAllEmails()
    .then(() => {
        console.log("All emails have been embedded successfully.");
    })
    .catch((error) => {
        console.error("Error embedding emails:", error);
    });
