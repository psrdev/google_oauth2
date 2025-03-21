const axios = require("axios");
const getNewAccessToken = require('./Auth/getNewAccessToken');

// const CLIENT_ID = process.env.CLIENT_ID;
const DEVELOPER_TOKEN = process.env.DEVELOPER_TOKEN;
const CUSTOMER_ID = process.env.CUSTOMER_ID;
const MCC_CUSTOMER_ID = process.env.MCC_CUSTOMER_ID;


async function getGoogleAdsData() {
    const accessToken = await getNewAccessToken();
    console.log("Access Token:", accessToken);

    if (!accessToken) {
        console.error("Failed to retrieve access token");
        return;
    }



    try {
        const response = await axios.post(
            `https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/googleAds:search`,
            {
                query: "SELECT customer.id, customer.descriptive_name FROM customer",
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "developer-token": DEVELOPER_TOKEN,
                    "Content-Type": "application/json",
                    // "login-customer-id": MCC_CUSTOMER_ID,
                },
            }
        );

        console.log("Google Ads API Response:", response.data);
    } catch (error) {
        console.error("Error fetching Google Ads data:", error.response ? error.response.data : error.message);
    }
}

// Run the function
getGoogleAdsData();