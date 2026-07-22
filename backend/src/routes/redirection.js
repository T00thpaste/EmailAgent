import express from "express";
import oauth2Client from "../config/oAuth.js";
import {google} from "googleapis";

const router = express.Router();

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
  });

  res.redirect(url);
});

export default router;

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log(tokens);

    res.send("Authentication successful!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Authentication failed");
  }
});

router.get("/emails", async (req, res) => {
  try {
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

        const headers = email.data.payload.headers;

        return {
          from: headers.find(h => h.name === "From")?.value,
          subject: headers.find(h => h.name === "Subject")?.value,
          date: headers.find(h => h.name === "Date")?.value,
        };
      })
    );

    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});