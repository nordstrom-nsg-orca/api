'use strict';

const db = require('../common/db.js');
const corsHeaders = require('../common/headers.js');
const { respond } = require('../common/respond.js');
const { Client } = require('pg');
const { authorize } = require('../common/auth.js');

exports.handler = async (event, context, callback, test = false) => {
  const client = new Client(db);
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  const token = await authorize(event.headers.Authorization);

  if (!token.valid && test === false)
    return respond(403, 'token error', headers);

  try {
    await client.connect();
  } catch (err) {
    return respond(500, 'database connection error', headers);
  }

  // const groups = `'${token.jwt.claims.groups_whitelist.join('\',\'')}'`;
  // const query = `SELECT * FROM orca.group_permission WHERE name in (${groups})`;

  let name;
  let query;
  let pages;
  let permissions;
  query = 'SELECT * FROM orca.page ORDER BY url DESC';

  try {
    pages = await client.query(query);
  } catch (err) {
    console.log(err);
    await client.end();
    return respond(400, 'query error', headers);
  }

  if ('jwt' in token) {
    name = `'${token.jwt.claims.groups_whitelist.join('\',\'')}'`;
    query = `SELECT * FROM orca.group_page_permission_view WHERE group_id = (SELECT id FROM orca.group WHERE name IN (${name}))`;
  } else {
    name = token.username;
    query = `SELECT * FROM orca.user_page_permission_view WHERE user_id = (SELECT id FROM orca.user WHERE username = '${name}')`;
  }

  try {
    permissions = await client.query(query);
  } catch (err) {
    console.log(err);
    await client.end();
    return respond(400, 'query error', headers);
  }

  const results = {};
  // builds out all pages
  for (let i = 0; i < pages.rows.length; i++) {
    const page = pages.rows[i];
    if (!(page.tab in results) && page.tab !== '') {
      results[page.tab] = {
        name: page.name,
        pages: {},
        allowed: false
      };
    }

    const url = page.url.substring(1); // get rid of '/' in front
    if (!(url.includes('*'))) {
      results[page.tab].pages[url] = {
        name: page.title,
        loadUrl: page.loadurl,
        crudUrl: page.crudurl,
        parentId: page.parentid,
        allowed: false,
        write: false
      };
    }
  }

  // builds out permission
  for (let i = 0; i < permissions.rows.length; i++) {
    const permission = permissions.rows[i];
    const tab = permission.tab;
    const url = permission.url;
    if (url.includes('*') && tab in results) {
      results[tab].allowed = permission.write;
      for (const page in results[tab].pages) {
        results[tab].pages[page].allowed = permission.write;
        results[tab].pages[page].write = permission.write;
      }
    } else if (tab === '' && url.includes('*')) { // admin user permission level
      for (const data in results) {
        results[data].allowed = permission.write;
        for (const page in results[data].pages) {
          results[data].pages[page].allowed = permission.write;
          results[data].pages[page].write = permission.write;
        }
      }
    } else {
      results[tab].pages[url.substring(1)].allowed = permission.write;
      results[tab].pages[url.substring(1)].write = permission.write;
    }
  }

  // const pages = {};
  // for (let i = 0; i < cursor.rows.length; i++) {
  //   const r = cursor.rows[i];
  //
  //   if (!(r.url in pages)) {
  //     // check for wildcard overlaps and remove them
  //     if (r.url.includes('*')) {
  //       for (const key in pages) {
  //         if (key.search(r.url) > -1 && (r.write || !pages[key]))
  //           delete pages[key];
  //       }
  //     }
  //
  //     pages[r.url] = r.write;
  //   } else {
  //     // url does exist and was read only, but now can write
  //     if (!pages[r.url] && r.write)
  //       pages[r.url] = r.write;
  //   }
  // }

  await client.end();
  return respond(200, results, headers);
};
