import { fetchInboxEmails } from "../services/gmailService.js";

export async function getEmails(req, res) {
  try {
    const emails = await fetchInboxEmails();

    res.json(emails);
  } catch (err) {
    console.error(err);

    res.status(500).send(err.message);
  }
}