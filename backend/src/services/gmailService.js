import { google } from "googleapis";
import oauth2Client from "../config/oAuth.js";
import { buildInboxEmail, buildFullEmail } from "../utils/emailFormatter.js";

function getGmailClient() {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
}

export async function getInboxEmails() {
  const gmail = getGmailClient();

  const { data: profile } = await gmail.users.getProfile({
    userId: "me",
  });

  const { data } = await gmail.users.messages.list({
    userId: "me",
    maxResults: 50,
  });

  const emails = await Promise.all(
    data.messages.map(async (msg) => {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
      });

      return buildInboxEmail(email.data);
    })
  );

  return {
    emails,
    historyId: profile.historyId,
  };
}

export async function getEmailById(id) {
    const gmail = getGmailClient();

    const { data } = await gmail.users.messages.get({
        userId: "me",
        id,
        format: "full",
    });

    return buildFullEmail(data);
}

export async function getHistory(startHistoryId) {
  const gmail = getGmailClient();

  const { data } = await gmail.users.history.list({
    userId: "me",
    startHistoryId,
  });

  return data;
}

export async function getInboxEmailById(id) {
    const gmail = getGmailClient();

    const { data } = await gmail.users.messages.get({
        userId: "me",
        id,
        format: "metadata",
    });

    return buildInboxEmail(data);
}