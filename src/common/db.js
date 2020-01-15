const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
let db;
if (process.env.NODE_ENV === 'test') {
  db = {
    host: 'nsgexternaldb.clqzasuuu8wm.us-west-2.rds.amazonaws.com', // server name or IP address;
    port: 5432,
    database: 'nsgExternalDB',
    user: 'nsg',
    password: process.env.NSG_DB_PASS,
    connectionTimeoutMillis: 2000
  };
} else {
  db = {
    host: 'nsgclouddb.clqzasuuu8wm.us-west-2.rds.amazonaws.com', // server name or IP address;
    // host: 'nsgexternaldb.clqzasuuu8wm.us-west-2.rds.amazonaws.com',
    port: 5432,
    database: 'nsgCloudDB',
    user: 'nsg',
    password: process.env.NSG_DB_PASS,
    connectionTimeoutMillis: 2000
  };
}
module.exports = db;
