import { getInboxEmails, getEmailById } from "../services/gmailService.js";
import emailCache from "../cache/emailCache.js";

export async function getEmails(req, res) {
  try {
    if (!emailCache.isInitialized()) {
        console.log("Cache Miss");
        const emails = await getInboxEmails();
        emailCache.replaceAll(emails);
    }

    else {
        console.log("Cache Hit");
    }

    res.json(emailCache.getAll());

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

export async function getEmail(req, res) {
  try {
    const email = await getEmailById(req.params.id);
    res.json(email);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}