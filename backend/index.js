const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// LNBits demo API config
const LNBITS_API_URL = 'https://legend.lnbits.com'; // Demo instance
const LNBITS_API_KEY = '9b1e1b7b2b7d4e2e8e2e8e2e8e2e8e2e'; // Demo wallet admin key (replace for production)

// Get live BTC/USD rate
app.get('/api/rate', async (req, res) => {
  try {
    const resp = await axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    const rate = parseFloat(resp.data.data.amount);
    res.json({ rate });
  } catch (err) {
    res.json({ rate: 40000 }); // fallback
  }
});

// Default route for root
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

let channels = [];
let payments = [];
let merchantAmountUSD = null;
// Merchant sets the amount for the customer

// --- Customer Endpoints ---
app.get('/api/customer/amount', (req, res) => {
  res.json({ amountUSD: merchantAmountUSD || 0 });
});

app.post('/api/customer/send', (req, res) => {
  // Simulate payment processing
  const { description, btcRate } = req.body;
  const fee = ((merchantAmountUSD || 0) * 0.015);
  const usdPayout = (merchantAmountUSD || 0) - fee;
  payments.push({
    description,
    btcRate,
    usdPayout,
    fee,
    walletAddress: '0xE7BCEeAb415b07eDf836B79Ed0Ab5DD05F7F1171',
    timestamp: Date.now()
  });
  res.json({ status: 'success', message: 'Payment processed.' });
});

// --- Hub Endpoints ---
app.get('/api/hub/amount', (req, res) => {
  res.json({ amountUSD: merchantAmountUSD || 0 });
});

app.get('/api/hub/payments', (req, res) => {
  res.json({ payments });
});

// --- Merchant Endpoints ---
app.post('/api/merchant/set-amount', (req, res) => {
  merchantAmountUSD = req.body.amountUSD;
  res.json({ status: 'success', amountUSD: merchantAmountUSD });
});

app.get('/api/merchant/received', (req, res) => {
  // Return all payments received
  res.json({ received: payments });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});


