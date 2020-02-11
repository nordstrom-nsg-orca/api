'use strict';

const corsHeaders = require('../common/headers.js');
const responder = require('../common/respond.js');
const auth = require('../common/auth.js');
const fetch = require('node-fetch').default;
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});
const domain = 'https://infoblox.nordstrom.net/wapi/v2.10.3';

exports.handler = async (event, context, callback, test = false) => {
  const headers = corsHeaders.verifyOrigin(event.headers.origin);

  const path = event.path.split('/')[3];
  const token = await auth.verifyToken(event.headers.Authorization);
  const logPayload = {};
  if (!token.valid && test === false) {
    logPayload.error = token.err.name + ' ' + token.err.userMessage;
    return responder.respond(403, 'token error', headers, logPayload);
  } else logPayload.user = token.jwt.claims.sub;

  let response;
  let endpoint;
  let results;
  let key;
  if (path === 'getGroups') {
    const fields = '_return_fields=roles,name';
    endpoint = `/admingroup?${fields}`;
    response = await request('nsg', process.env.NSG_DB_PASS, endpoint);
    key = 'groups';
  } else {
    endpoint = '/permission';
    response = await request('nsg', process.env.NSG_DB_PASS, endpoint);
    key = 'permissions';
  }

  if ('error' in response) return responder.respond(500, response, headers, logPayload);
  const statusCode = response.status;
  if (statusCode !== 200) {
    logPayload.err = response.statusText;
    return responder.respond(statusCode, { msg: response.statusText }, headers, logPayload);
  }
  const json = await response.json();
  if (key === 'groups') results = { groups: json };
  else results = { permissions: json };

  return responder.respond(200, results, headers, logPayload);
};

async function request (username, password, endpoint) {
  let response;
  try {
    const opts = {
      method: 'GET',
      headers: { Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64') },
      agent: httpsAgent
    };
    response = await fetch(`${domain}${endpoint}`, opts);
    response.shouldKeepAlive = false;
    return response;
  } catch (err) {
    return { error: err };
  }
}
