import { google } from "googleapis";
import oauth2Client from "../config/oAuth.js";
import { formatEmail } from "../utils/emailFormatter.js";

export async function fetchInboxEmails() {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  const emails = await Promise.all(
    response.data.messages.map(async (msg) => {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      return formatEmail(email.data);
    })
  );

  return emails;
}