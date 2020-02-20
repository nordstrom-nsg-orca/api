'use strict';

const corsHeaders = require('../common/headers.js');
const { respond } = require('../common/respond.js');
const { authorize } = require('../common/auth.js');
const fetch = require('node-fetch').default;
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});
const domain = 'https://infoblox.nordstrom.net/wapi/v2.10.3';

exports.handler = async (event, context, callback, test = false) => {
  const headers = corsHeaders.verifyOrigin(event.headers.origin);

  let endpoint = event.pathParameters.endpoint;
  let query = '';
  if (event.queryStringParameters) {
    const keys = Object.keys(event.queryStringParameters);
    for (const key of keys) query += event.queryStringParameters[key];
  };

  if (query !== '') endpoint += `?_return_fields=${query}`;
  const action = event.httpMethod;
  const token = await authorize(event.headers.Authorization);
  const logPayload = {};
  if (!token.valid && test === false) {
    logPayload.error = token.err;
    return respond(403, 'token error', headers, logPayload);
  } else
    logPayload.user = token.username;

  const response = await request('nsg', process.env.NSG_DB_PASS, endpoint, action);

  if ('error' in response) return respond(500, response, headers, logPayload);
  const statusCode = response.status;
  if (statusCode !== 200) {
    logPayload.err = response.statusText;
    return respond(statusCode, { msg: response.statusText }, headers, logPayload);
  }
  const json = await response.json();
  const results = { data: json };

  return respond(200, results, headers, logPayload);
};

async function request (username, password, endpoint, action) {
  let response;
  try {
    const opts = {
      method: `${action}`,
      headers: { Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64') },
      agent: httpsAgent
    };
    response = await fetch(`${domain}/${endpoint}`, opts);
    response.shouldKeepAlive = false;
    return response;
  } catch (err) {
    return { error: err };
  }
}
