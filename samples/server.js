require('dotenv').config();

const express = require('express');
const tendopay = require('../');

const app = express();

const tendoPayClient = new tendopay.Client();
tendoPayClient.enableSandbox();

app.get('/', (req, res) => {
  res.redirect('/cart');
});

app.use('/cart', express.static('cart.html'));

app.post('/purchase', (req, res) => {
  // Handle payment
  res.send('TODO Purchase');
});

app.listen(8000, () => {
  console.log('App listening on port 8000');
});
