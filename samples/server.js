require('dotenv').config();

const express = require('express');
const tendopay = require('../');

const tendoPayClient = new tendopay.Client();
tendoPayClient.enableSandbox();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.redirect('/cart');
});

app.use('/cart', express.static('cart.html'));

app.post('/purchase', (req, res) => {
  const merchantId = 'TEST-OID-1234567890';
  const orderAmount = +req.body.price || 0;
  const orderTitle = 'Test Order #1';

  console.log(merchantId, orderAmount, orderTitle);

  const tendoPayPayment = new tendopay.Payment({
    merchantId,
    requestAmount: orderAmount,
    description: orderTitle
  });

  res.end('TODO');
});

app.listen(8000, () => {
  console.log('App listening on port 8000');
});
