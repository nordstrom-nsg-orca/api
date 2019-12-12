'use strict';

const db = require('./common/db.js');

const { Client } = require('pg');
const client = new Client(db);
client.connect();

exports.handler = async(event, context) => {
  const query = `SELECT * FROM ${event.pathParameters.table}`;
  
  let res = null;
  try {
    res = await client.query(query);
  } catch (err) {
    return {
      "statusCode": 500,
      "body": JSON.stringify(err)
    }
  }
  
  return {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
    },
    "body": JSON.stringify(res.rows)
  }
}