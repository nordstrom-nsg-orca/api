'use strict';

const Schema = require('./common/schema.js');
const db = require('./common/db.js');

const { Client } = require('pg');
const client = new Client(db);
client.connect();

exports.handler = async(event, context) => {
  console.log("EVENT");
  console.log(event);
  console.log("\n")

  const schema = await Schema.build(client, event.pathParameters.table, 'create');
  const valid = Schema.validate(event, schema, 'create');

  if (!valid.valid)
    return {
      statusCode: 400,
      body: valid.errs
    }

  const query = `INSERT INTO access_item(list_id, subnet, description) 
  VALUES ($1, $2, $3) RETURNING id`;
  const values = [event['list_id'], event['subnet'], event['description']];

  let res = null;
  try {
    res = await client.query(query, values);
  } catch (err) {
    return {
      statusCode: 500,
      body: err
    }
  }
  
  return {
    statusCode: 200,
    body: res.rows[0].id
  }
}