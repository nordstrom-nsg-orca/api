const dotenv = require('dotenv');
dotenv.config();
const db = {
    host: process.env.NSG_DB_URL, // server name or IP address;
    port: 5432,
    database: process.env.NSG_DB_NAME,
    user: process.env.NSG_DB_USER,
    password: process.env.NSG_DB_PSSW,
    // query_timeout: 5500
};

module.exports = db;
