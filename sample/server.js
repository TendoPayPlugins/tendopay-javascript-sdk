require('dotenv').config();

const express = require('express');
const tendopay = require('../');

const TendoPayClient = tendopay.Client;
const tendoPayClient = new TendoPayClient(true);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.redirect('/cart');
});

app.use('/cart', express.static('cart.html'));

app.get('/purchase', (req, res) => {
  if (TendoPayClient.isCallbackRequest({request: req})) {
    res.json(req.query);
  } else {
    res.json({
      error: 'Not a callback request'
    });
  }
});

app.post('/purchase', async (req, res) => {
  const merchantOrderId = 'TEST-OID-1234567890';
  const orderAmount = +req.body.price || 0;
  const orderTitle = 'Test Order #1';

  const tendoPayPayment = new tendopay.Payment({
    merchantOrderId,
    requestAmount: orderAmount,
    description: orderTitle
  });

  tendoPayClient.payment = tendoPayPayment;

  res.redirect(await tendoPayClient.getTendoPayURL());
});

app.listen(8000, () => {
  console.log('App listening on port 8000');
});
