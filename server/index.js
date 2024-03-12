const express = require('express');
const path = require('path'); 
require('dotenv').config();

require("@shopify/shopify-api/adapters/node");
const { shopifyApi, LATEST_API_VERSION } = require("@shopify/shopify-api");

const shopify = shopifyApi({
    apiKey: process.env.CLIENT_ID,
    apiSecretKey: process.env.CLIENT_KEY,
    scopes: ["read_products"],
    hostName: process.env.HOST_NAME,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false
});

const app = express();
const port = 3001;

const shop = process.env.STORE_URL;
const storefrontAccessToken = process.env.STOREFRONT_ACCESS_TOKEN;
console.log('storefrontAccessToken:', storefrontAccessToken);
console.log('Store Domain:', shop);

if (!storefrontAccessToken) {
    console.error('Error: storefrontAccessToken is undefined. Make sure the environment variable is set.');
    process.exit(1); // Exit the process to prevent further execution
}

// Async function to create the storefront client
const createClient = async () => {
    try {
        const storefrontAccessToken = process.env.STOREFRONT_ACCESS_TOKEN
        const storeDomain = process.env.STORE_URL;

        if (!storefrontAccessToken) {
            throw new Error("Storefront access token is missing or undefined.");
        }

        if (!storeDomain || storeDomain === undefined) {
            throw new Error("Shop domain is missing or undefined.");
        }

        //console.log(storeDomain);

        const client = new shopify.clients.Storefront({
            domain: storeDomain,
            //storefrontAccessToken,
            session: {
                accessToken: storefrontAccessToken,
                storeDomain:  storeDomain
            }
        });
        console.log("Client Object:", client);
        return client;
        
    } catch (error) {
        console.error("Error creating storefront client:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
};


app.get("/", async (req, res) => {
    try {
        const client = await createClient();
        const products = await client.query({
            data: `{
                products (first: 3) {
                    edges {
                        node {
                            id
                            title
                        }
                    }
                }
            }`,
        });
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});


// static file
app.use(express.static(path.resolve(__dirname, '../client/build')));

// listening for requests
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));