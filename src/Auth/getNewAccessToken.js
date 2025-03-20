const axios = require("axios");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

async function getNewAccessToken() {
    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                grant_type: "refresh_token",
            },
        });

        // console.log("Access Token:", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Error refreshing access token:", error.response?.data || error.message);
        return null;
    }
}

module.exports = getNewAccessToken;