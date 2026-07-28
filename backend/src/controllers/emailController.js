import { getInboxEmails, getEmailById } from "../services/gmailService.js";
import emailCache from "../cache/emailCache.js";

export async function getEmails(req, res) {
  try {
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