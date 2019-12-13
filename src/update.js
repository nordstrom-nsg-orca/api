'use strict';

const Schema = require('./common/schema.js');
const db = require('./common/db.js');

const { Client } = require('pg');
const client = new Client(db);
client.connect();

exports.handler = async(event, context) => {
  const table = event.pathParameters.table;
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const schema = await Schema.build(client, table, 'update');
  const valid = Schema.validate(body, schema, 'update');
  // console.log(valid);
  if (!valid.valid)
    return {
      "statusCode": 400,
      "body": JSON.stringify(valid.errs)
    }

  const query = buildQuery(id, table, schema, body);
  // console.log(query);
  let res = null;
  try {
    res = await client.query(query.query, query.values);
    console.log(res);
  } catch (err) {
    return {
      "statusCode": 500,
      "body": JSON.stringify(err)
    }
  }

  return {
    "statusCode": 200,
    "body": JSON.stringify({id: res.rows[0].id})
  }
}

function buildQuery(id, table, schema, body) {
  let query = `UPDATE ${table}`;
  let cols = ' SET ';
  let valsArr = [];
  let i = 1;
  for (let key in schema.properties) {
    if (typeof body[key] !== 'undefined') {
      if (i > 1) {
        cols += `, ${key} = $${i}`;
      } else {
        cols += `${key} = $${i}`;
      }
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
// handler();
