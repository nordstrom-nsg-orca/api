'use strict';

const db = require('../common/db.js');
const corsHeaders = require('../common/headers.js');
const { respond } = require('../common/respond.js');
const { Client } = require('pg');
const auth = require('../common/auth.js');

exports.handler = async (event, context, callback, test = false) => {
  const client = new Client(db);
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  const token = await auth.verifyToken(event.headers.Authorization);
  let cursor;

  if (!token.valid && test === false)
    return respond(403, 'token error', headers);

  try {
    await client.connect();
  } catch (err) {
    return respond(500, 'database connection error', headers);
  }

  const groups = JSON.stringify(token.jwt.claims.groups_whitelist).replace(/"/g, "'");
  const query = `SELECT * FROM orca.get_pages(Array${groups}::text[])`;

  try {
    cursor = await client.query(query);
  } catch (err) {
    await client.end();
    return respond(400, 'query error', headers);
  }

  await client.end();
  return respond(200, cursor.rows[0].get_pages);
};
