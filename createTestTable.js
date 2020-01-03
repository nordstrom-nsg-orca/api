const db = require('./src/common/db.js');
const { Client } = require('pg');
const client = new Client(db);

client.on('error', (error) => {
  console.log(err);
  process.exit();
});
const TABLE_NAME = 'test';
try {
  client.connect();
} catch(err) {
  console.log(err);
  process.exit();
}
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
