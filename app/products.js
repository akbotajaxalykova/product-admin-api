const express = require('express');
const router = express.Router();
const fileDb = require('../fileDb.js');
const nanoid = require('nanoid');
const multer = require('multer');
const path = require('path');
const config = require('../config.js');
const mongoDb = require('../mongoDb.js');
const ObjectId = require('mongodb').ObjectId;
const Product= require('../models/product-model.js')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const db = mongoDb.getDb();
    const results = await db.collection('products').find().toArray();
    res.send(results);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = mongoDb.getDb();
    const products = db.collection('products');
    const result = await products.findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      return res.json(result);
    }
    res.status(404);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.sendStatus(500);
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const db = mongoDb.getDb();
    const product = {
      ...req.body,
      image: req.file ? req.file.filename : null,
    };
    const result = await db.collection('products').insertOne(product);
    res.status(201).send({
      _id: result.insertedId,
      ...product,
    });
  } catch (error) {
    console.error('Creating product failed:', error);
    res.status(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = mongoDb.getDb();
    const products = db.collection('products');
    const result = await products.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 1) {
      return res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
