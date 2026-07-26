import { getInboxEmails, getEmailById } from "../services/gmailService.js";

export async function getEmails(req, res) {
  try {
    const emails = await getInboxEmails();
    res.json(emails);
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