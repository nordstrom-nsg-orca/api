'use strict';

const db = require('./common/db.js');
const auth = require('./common/auth.js');

const { Client } = require('pg');
const client = new Client(db);
client.connect();

exports.handler = async(event, context) => {
  // let token = await auth.verifyToken(event.headers.Authorization);
  // if (!token.valid) {
  //   return {
  //     "statusCode": 403,
  //     "body": JSON.stringify({"msg": "token invalid"})
  //   }
  // }

  const table = event.pathParameters.table;
  const id = event.pathParameters.id;

  const query = buildQuery(table, id);

  let res = null;
  try {
    res = await client.query(query.query, query.values);
    // console.log(res);
  } catch (err) {
    return {
      "statusCode": 500,
      "body": JSON.stringify(`{"msg": "${err}"}`)
    }
  }

  return {
    "statusCode": 200,
    "body": JSON.stringify("ok"),
    "headers": {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
    }
  }
}

function buildQuery(table, id) {
  return {
    query: `DELETE FROM ${table} WHERE id = $1`,
    values: [id]
  }
}
