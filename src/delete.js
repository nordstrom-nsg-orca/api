'use strict';

const db = require('./common/db.js');
const auth = require('./common/auth.js');

// const { Client } = require('pg');
const Pool = require('pg-pool')

exports.handler = async(event, context) => {

  // const client = new Client(db);
  const pool = new Pool(db);
  let client;
  try{
    client = await pool.connect();
  } catch(err) {
    await pool.end();
    return {
      "statusCode": 500,
      "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET"
      },
      "body": JSON.stringify({msg: 'Failed to connect to database.'})
    }
  }

  const table = event.pathParameters.table;
  const id = event.pathParameters.id;

  const query = buildQuery(table, id);

  let res = null;
  try {
    res = await client.query(query.query, query.values);
  } catch (err) {
    await pool.end();
    return {
      "statusCode": 500,
      "body": JSON.stringify(`{"msg": "${err}"}`)
    }
  }
  await client.release();
  await pool.end();
  return {
    "statusCode": 200,
    "body": JSON.stringify("ok"),
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
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
