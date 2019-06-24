require('dotenv').config();

const express = require('express');
const tendopay = require('../');

const app = express();

const TendoPayClient = new tendopay.Client();

app.use('/cart', express.static('cart.html'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8000);
