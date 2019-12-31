const db = require('./src/common/db.js');
// console.log(db);
const { Client } = require('pg');
const client = new Client(db);
const TABLE_NAME = 'test';
client.connect();
const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
)`;


try {
  client.query(query).then(res => {
    console.log(res);
    process.exit();
  });
} catch(err) {
  console.log(err);
  process.exit();
}
