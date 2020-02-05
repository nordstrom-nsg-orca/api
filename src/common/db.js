module.exports = {
  host: 'nsgclouddb.clqzasuuu8wm.us-west-2.rds.amazonaws.com',
  port: 5432,
  database: 'nsgCloudDB',
  user: 'nsg',
  password: process.env.NSG_DB_PASS,
  connectionTimeoutMillis: 2000
};
