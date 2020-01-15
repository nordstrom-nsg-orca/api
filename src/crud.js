'use strict'
const Schema = require('./common/schema.js');
const db = require('./common/db.js');
const corsHeaders = require('./common/headers.js');
const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  const table = event.pathParameters.table;
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body || '{}');
  const action = event.httpMethod;
  const client = new Client(db);
  let schema, curr, resp;

  try {
    await client.connect();
  } catch (err) {
    return response(500, { err: err.message }, headers);
  }

  if (['PUT', 'POST'].includes(action)) {
    schema = await Schema.build(client, table, action);
    const valid = Schema.validate(body, schema, action);

    if (!valid.valid) {
      await client.end();
      return response(400, { err: valid.errs }, headers);
    }
  }

  const query = buildQuery(id, table, schema, action, body);
  try {
    curr = await client.query(query.query, query.values);
  } catch (err) {
    await client.end();
    return response(500, { err: err }, headers);
  }

  if (action === 'GET') {
    resp = curr.rows;
  } else if (action === 'POST') {
    resp = curr.rows[0];
  } else {
    resp = 'ok';
  }

  await client.end();
  return response(200, resp, headers);
}

function response (statusCode, msg, headers) {
  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(msg)
  }
}

function buildQuery (id, table, schema, action, body) {
  if (action === 'GET') {
    return { query: `SELECT * FROM ${table}`, values: [] };
  } else if (action === 'DELETE') {
    return { query: `DELETE FROM ${table} WHERE id = $1`, values: [id] };
  } else if (['POST', 'PUT']) {
    let query;
    const cols = [];
    const valIndex = [];
    const vals = [];
    let i = 1;
    for (const key in schema.properties) {
      if (typeof body[key] !== 'undefined') {
        cols.push(key);
        valIndex.push(`$${i}`);
        vals.push(body[key]);
        i++;
      }
    }

    if (action === 'POST') {
      query = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${valIndex.join(',')}) RETURNING id`;
    } else if (action === 'PUT') {
      query = `UPDATE ${table} SET ${cols.map((e, i) => `${e}=$${i + 1}`).join(',')} WHERE id = ${id}`;
    }

    return {
      query: query,
      values: vals
    }
  }

  return null;
}
