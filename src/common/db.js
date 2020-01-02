const dotenv = require('dotenv');
dotenv.config();
const db = {
    // host: process.env.NSG_DB_URL, // server name or IP address;
    host: 'nsgexternaldb.clqzasuuu8wm.us-west-2.rds.amazonaws.com',
    port: 5432,
    // database: process.env.NSG_DB_NAME,
    database: 'nsgExternalDB',
    user: process.env.NSG_DB_USER,
    password: process.env.NSG_DB_PSSW,
    // query_timeout: 5500
};

module.exports = db;
