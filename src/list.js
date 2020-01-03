'use strict';

const db = require('./common/db.js');
const corsHeaders = require('./common/headers.js');
const auth = require('./common/auth.js');

const { Client } = require('pg');
const client = new Client(db);
client.connect();

exports.handler = async(event, context) => {
  // console.log(event);
  // let token = await auth.verifyToken(event.headers.Authorization);
  // if (!token.valid) {
  //   return {
  //     "statusCode": 403,
  //     "body": JSON.stringify({"msg": "token invalid"})
  //   }
  // }

  const query = `SELECT * FROM ${event.pathParameters.table}`;
  // console.log(query);
  let res = null;
  try {
    res = await client.query(query);
  } catch (err) {
    return {
      "statusCode": 500,
      "body": JSON.stringify(err)
    }
  }

  // console.log('query good');
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
