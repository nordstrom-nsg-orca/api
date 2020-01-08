'use strict';

const Schema = require('./common/schema.js');
const db = require('./common/db.js');
const auth = require('./common/auth.js');

const { Client } = require('pg');

// client.connect();

exports.handler = async(event, context) => {
  const client = new Client(db);
  try{
    await client.connect();
  } catch(err) {
    client.end();
    return {
      "statusCode": 500,
      "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "POST"
      },
      "body": JSON.stringify({msg: 'Failed to connect to database.'})
    }
  }

  const table = event.pathParameters.table;
  const body = JSON.parse(event.body);
  const schema = await Schema.build(client, table, 'create');
  const valid = Schema.validate(body, schema, 'create');
  if (!valid.valid)
    return {
      "statusCode": 400,
      "body": JSON.stringify(valid.errs)
    }

  const query = buildQuery(table, schema, body);
  let res = null;
  try {
    res = await client.query(query.query, query.values);
  } catch (err) {
    client.end();
    return {
      "statusCode": 500,
      "body": JSON.stringify(err)
    }
  }
  client.end();
  return {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST"
    },
    "body": JSON.stringify({id: res.rows[0].id})
  }
}

function buildQuery(table, schema, body) {
  let query = `INSERT INTO ${table}`;
  let cols = '(';
  let vals = 'VALUES(';
  let valsArr = [];
  let i = 1;
  for (let key in schema.properties) {
    if (typeof body[key] !== 'undefined') {
      cols += `${key},`;
      vals += `$${i},`
      valsArr.push(body[key]);
      i++;
    }
  }
  cols = `${cols.slice(0, -1)})`
  vals = `${vals.slice(0, -1)})`

  return {
    query: `${query}${cols} ${vals} RETURNING id`,
    values: valsArr
  }

}
