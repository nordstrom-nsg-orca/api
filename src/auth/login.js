'use strict';

const db = require('../common/db.js');
const corsHeaders = require('../common/headers.js');
const { respond } = require('../common/respond.js');
const { Client } = require('pg');

exports.handler = async (event, context, callback) => {
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  let creds = event.headers.Authorization;
  let cursor;

  if (creds.startsWith('Basic '))
    creds = creds.substr(5);

  creds = Buffer.from(creds, 'base64').toString();

  const username = creds.split(':')[0];
  const password = creds.split(':')[1];

  const client = new Client(db);
  const logPayload = {};

  // attempt connection to database
  try {
    await client.connect();
  } catch (err) {
    logPayload.error = err.message;
    return respond(500, 'database connection error', headers, logPayload);
  }

  const query = 'SELECT id FROM orca.user WHERE username=$1 and password=$2';
  const values = [username, password];
  try {
    cursor = await client.query(query, values);
  } catch (err) {
    logPayload.error = err;
    await client.end();
    return respond(400, 'query error', headers, logPayload);
  }

  if (cursor.rows.length >= 1)
    return respond(200, 'Authenticated', headers, logPayload);

  logPayload.error = 'Failed to authenticate admin user';
  return respond(403, 'Forbidden', headers, logPayload);
};
