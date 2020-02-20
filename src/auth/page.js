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

  const groups = `'${token.jwt.claims.groups_whitelist.join('\',\'')}'`;
  const query = `SELECT * FROM orca.group_permission WHERE name in (${groups})`;

  try {
    cursor = await client.query(query);
  } catch (err) {
    await client.end();
    return respond(400, 'query error', headers);
  }

  const pages = {};
  for (let i = 0; i < cursor.rows.length; i++) {
    const r = cursor.rows[i];

    if (!(r.url in pages)) {
      // check for wildcard overlaps and remove them
      if (r.url.includes('*')) {
        for (const key in pages) {
          if (key.search(r.url) > -1 && (r.write || !pages[key]))
            delete pages[key];
        }
      }

      pages[r.url] = r.write;
    } else {
      // url does exist and was read only, but now can write
      if (!pages[r.url] && r.write)
        pages[r.url] = r.write;
    }
  }

  await client.end();
  return respond(200, pages, headers);
};
