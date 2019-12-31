const db = require('./src/common/db.js');
console.log(db);
const { Client } = require('pg');
const client = new Client(db);
const TABLE_NAME = 'test';
client.connect();
const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
)`;


client.query(query).then(res => {
  try {
    console.log(res);
  } catch(err) {
    console.log(err);
  }
  process.exit();
});
