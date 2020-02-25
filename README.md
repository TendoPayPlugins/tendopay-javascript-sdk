# TendoPay SDK for Node

## Requirements

Node 8.0 and later.

## Run sample server

- Install dependencies of the SDK
```bash
npm install
```

- Install dependencies of the sample server
```bash
cd sample && npm install
```

- Add some environment variables into `.env`
  > `MERCHANT_ID`, `MERCHANT_SECRET` for test can be found on the [TendoPay Sandbox](https://sandbox.tendopay.ph)

- Run the server
```bash
npm start
```
- Open browser and goto
```bash
http://localhost:8000
```

## Run tests

```bash
npm test
```
