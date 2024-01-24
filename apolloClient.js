// In a file, e.g., apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const shopifyApiEndpoint = 'https://ruff.myshopify.com/admin/api/2022-01/graphql.json';
const apiKey = process.env.API_KEY;

const httpLink = createHttpLink({
  uri: shopifyApiEndpoint,
  headers: {
    'X-Shopify-Storefront-Access-Token': apiKey,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
