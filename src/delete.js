'use strict';

const db = require('./common/db.js');

const { Client } = require('pg');
const client = new Client(db);
client.connect();

exports.handler = async(event, context) => {
  const table = event.pathParameters.table;
  const id = event.pathParameters.id;
  // const body = JSON.parse(event.body);

  const query = buildQuery(table, id);
  
  let res = null;
  try {
    res = await client.query(query.query, query.values);
    console.log(res);
  } catch (err) {
    return {
      "statusCode": 500,
      "body": JSON.stringify(`{"msg": "${err}"}`)
    }
  }
  
  return {
    "statusCode": 200,
    "body": JSON.stringify("ok")
  }
}

function buildQuery(table, id) {
  return {
    query: `DELETE FROM ${table} WHERE id = $1`,
    values: [id]
  }
}