require('dotenv').config();

const express = require('express');
const tendopay = require('../');

const app = express();

const TendoPayClient = new tendopay.Client();

app.use('/cart', express.static('cart.html'));

app.get('/', (req, res) => {
  res.redirect('/cart');
});

app.post('/purchase', (req, res) => {
  res.send('TODO Purchase');
});

app.listen(8000);
