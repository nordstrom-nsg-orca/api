'use strict';

const Schema = require('./common/schema.js');
const db = require('./common/db.js');
const auth = require('./common/auth.js');

const { Client } = require('pg');
const client = new Client(db);
// client.connect();

exports.handler = async(event, context) => {

  try{
    await client.connect();
  } catch(err) {
    return {
      "statusCode": 500,
      "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "PUT"
      },
      "body": JSON.stringify({msg: 'Failed to connect to database.'})
    }
  }

  const table = event.pathParameters.table;
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const schema = await Schema.build(client, table, 'update');
  const valid = Schema.validate(body, schema, 'update');
  if (!valid.valid)
    return {
      "statusCode": 400,
      "body": JSON.stringify(valid.errs)
    }

  const query = buildQuery(id, table, schema, body);

  let res = null;
  try {
    res = await client.query(query.query, query.values);
  } catch (err) {
    return {
      "statusCode": 500,
      "body": JSON.stringify(err)
    }
  }

  return {
    "statusCode": 200,
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "PUT"
    }
  }
}

function buildQuery(id, table, schema, body) {
  let query = `UPDATE ${table}`;
  let cols = ' SET ';
  let valsArr = [];
  let i = 1;
  for (let key in schema.properties) {
    if (typeof body[key] !== 'undefined') {
      cols += (i > 1 ? `, ${key} = $${i}`: `${key} = $${i}`);
      valsArr.push(body[key]);
      i++;
    }
  }
  valsArr.push(id);
  return {
    query: `${query}${cols} WHERE id = $${i} RETURNING id`,
    values: valsArr
  }
}
