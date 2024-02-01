const express = require('express');
const path = require('path'); 
const app = express();
const PORT = process.env.PORT || 3001;

const dotenv = require('dotenv');
dotenv.config();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post('/api/shopify', async (req, res) => {
    try {
      const shopifyApiEndpoint = 'https://2f7621-5.myshopify.com/admin/api/2022-01/graphql.json';
      const apiKey = process.env.API_KEY;
      const { query } = req.body;
  
      const response = await axios.post(
        shopifyApiEndpoint,
        { query },
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});