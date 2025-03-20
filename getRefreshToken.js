require('dotenv').config();

const express = require('express');
const querystring = require("querystring");
const open = require("open").default;
const axios = require('axios');
const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Validate environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error("Error: Missing required environment variables. Please set CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI.");
    process.exit(1);
}

// Step 1: Redirect user to Google's OAuth 2.0 consent screen
app.get("/", (req, res) => {
    res.send("<h1>Visit /auth to start authentication.</h1> <a href='/auth'>Start Authentication</a>");
});

app.get("/auth", (req, res) => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`;

    open(authUrl);
    res.send("Opening Google OAuth 2.0 consent screen...");
});

app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("Error: No authorization code found in the callback URL.");
    }

    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: REDIRECT_URI,
            },
        });

        res.send(`Refresh Token: ${response.data.refresh_token}`);
    } catch (error) {
        console.error("Error during token exchange:", error.response?.data || error.message);
        res.status(500).send("An error occurred while exchanging the authorization code. Please try again.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT}/auth to start authentication.`);
});