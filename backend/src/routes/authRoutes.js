import express from "express";
import oauth2Client from "../config/oAuth.js";
import { getEmails, getEmail } from "../controllers/emailController.js";

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

router.get("/emails", getEmails);

router.get("/emails/:id", getEmail);

export default router;