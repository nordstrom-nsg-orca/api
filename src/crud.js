'use strict';

const Schema = require('./common/schema.js');
const db = require('./common/db.js');
const corsHeaders = require('./common/headers.js');
const responder = require('./common/respond.js');
const { Client } = require('pg');
const auth = require('./common/auth.js');

exports.handler = async (event, context, callback, test = false) => {
  const table = event.pathParameters.table;
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body || '{}');
  const action = event.httpMethod;

  const client = new Client(db);
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  const token = await auth.verifyToken(event.headers.Authorization);

  let schema, cursor, resp;
  const logPayload = {
    table: table,
    action: action
  };

  if (!token.valid && test === false) {
    logPayload.error = token.err.name + ' ' + token.err.userMessage;
    return responder.respond(403, 'token error', headers, logPayload);
  } else
    logPayload.user = token.jwt.claims.sub;

  // attempt connection to database
  try {
    await client.connect();
  } catch (err) {
    logPayload.error = err.message;
    return responder.respond(500, 'database connection error', headers, logPayload);
  }

  // require schema validation on PUT and POST
  if (['PUT', 'POST'].includes(action)) {
    schema = await Schema.build(client, table, action);
    const valid = Schema.validate(body, schema, action);
    if (!valid.valid) {
      logPayload.error = `schema error ${valid.errs}`;
      logPayload.schema = schema;
      await client.end();
      return responder.respond(400, 'schema error', headers, logPayload);
    }
  }

  // build and attempt the query
  const query = buildQuery(id, table, schema, action, body);
  logPayload.query = query;

  try {
    cursor = await client.query(query.query, query.values);
  } catch (err) {
    logPayload.error = err;
    await client.end();
    return responder.respond(400, 'query error', headers, logPayload);
  }

  if (action === 'GET')
    resp = cursor.rows;
  else if (action === 'POST')
    resp = cursor.rows[0];
  else resp = 'ok';

  await client.end();
  return responder.respond(200, resp, headers, logPayload);
};

// builds the SQL query based on the action and schema
function buildQuery (id, table, schema, action, body) {
  table = `orca.${table}`;

  // GET and DELETES are very straighforward
  if (action === 'GET')
    return { query: `SELECT * FROM ${table}`, values: [] };
  else if (action === 'DELETE')
    return { query: `DELETE FROM ${table} WHERE id = $1`, values: [id] };

  // PUT and POST require the schema to build column and value arrays
  else if (action === 'PUT' || action === 'POST') {
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

    // use arrays to build '(col1,col2) VALUES ($1, $2)'
    if (action === 'POST') {
      query = `INSERT INTO ${table}
        (${cols.join(',')}) VALUES (${valIndex.join(',')})
        RETURNING id`;
    // use arrays to build `SET col1=$1, col2=$2`
    } else if (action === 'PUT') {
      query = `UPDATE ${table}
        SET ${cols.map((e, i) => `${e}=$${i + 1}`).join(',')}
        WHERE id = ${id}`;
    }

    return {
      query: query,
      values: vals
    };
  }

  return null;
}
