const MongoClient = require('mongodb').MongoClient;

let db = null;
let client = null;

const connect = async () => {
  client = await MongoClient.connect('mongodb://localhost:27017');
  db = client.db('shop');
};

const disconnect = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('MongoDB not initialized. Call connect() first.');
  }
  return db;
};

module.exports = {
  connect,
  disconnect,
  getDb,
};
