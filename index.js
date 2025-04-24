const express = require('express');
const app = express();
const port = 8000;
const products = require('./app/products');
const cors = require('cors');
const mongoose= require('mongoose')

async function start() {
  await mongoose.connect('mongodb://localhost:27017/shop');
  app.use(cors());
  app.use(express.static('public'));
  app.use(express.json());
  app.use('/products', products);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received - closing MongoDB connection');
    await disconnect();
    process.exit(0);
  });

  process.on('exit', () => {
    disconnect();
  });
}

start().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
