const dotenv = require('dotenv');
dotenv.config();
let db;
if (process.env.NODE_ENV === 'test') {
  db = {
      host: process.env.NSG_DB_TEST_URL, // server name or IP address;
      port: 5432,
      database: process.env.NSG_TEST_DB_NAME,
      user: process.env.NSG_DB_USER,
      password: process.env.NSG_DB_PSSW,
      query_timeout: 5500
  };
}
else {
  db = {
     host: process.env.NSG_DB_URL, // server name or IP address;
     port: 5432,
     database: process.env.NSG_DB_NAME,
     user: process.env.NSG_DB_USER,
     password: process.env.NSG_DB_PSSW,
     query_timeout: 5500
 };
}

module.exports = db;
