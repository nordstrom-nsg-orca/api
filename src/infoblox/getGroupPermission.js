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
  // const headers = {
  //   'Access-Control-Allow-Origin': 'something'
  // };

  const token = await auth.verifyToken(event.headers.Authorization);
  const logPayload = {};
  if (!token.valid && test === false) {
    logPayload.error = token.err.name + ' ' + token.err.userMessage;
    return responder.respond(403, 'token error', headers, logPayload);
  } else
    logPayload.user = token.jwt.claims.sub;

  let response = await getGroups('nsg', 'nsgseattle');
  if ('error' in response) return responder.respond(500, response, headers, logPayload);
  let statusCode = response.status;
  if (statusCode !== 200) {
    logPayload.err = response.statusText;
    return responder.respond(statusCode, { msg: response.statusText }, headers, logPayload);
  }
  const groups = await response.json();

  response = await getPermissions('nsg', 'nsgseattle');
  if ('error' in response) return responder.respond(500, response, headers, logPayload);
  statusCode = response.status;
  if (statusCode !== 200) {
    logPayload.err = response.statusText;
    return responder.respond(statusCode, { msg: response.statusText }, headers, logPayload);
  }
  const permissions = await response.json();
  const results = {
    groups: groups,
    permissions: permissions
  };
  return responder.respond(200, results, headers, logPayload);
};

async function getGroups (username, password) {
  let response;
  try {
    const fields = '_return_fields=roles,name';
    const opts = {
      method: 'GET',
      headers: { Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64') },
      agent: httpsAgent
    };
    response = await fetch(`${domain}/admingroup?${fields}`, opts);
    return response;
  } catch (err) {
    return { error: err };
  }
}

async function getPermissions (username, password) {
  let response;
  try {
    const opts = {
      method: 'GET',
      headers: { Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64') },
      agent: httpsAgent
    };
    response = await fetch(`${domain}/permission`, opts);
    return response;
  } catch (err) {
    return { error: err };
  }
}
