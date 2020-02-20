'use strict';

const corsHeaders = require('../common/headers.js');
const { respond } = require('../common/respond.js');
const { authorize } = require('../common/auth.js');

exports.handler = async (event, context, callback) => {
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  const creds = event.headers.Authorization;

  const auth = await authorize(creds);

  const logPayload = {};
  if (!auth.valid) {
    logPayload.error = auth.err;
    return respond(auth.status, auth.err, headers, logPayload);
  } else {
    logPayload.user = auth.username;
    return respond(auth.status, 'Authenticated', headers, logPayload);
  }
};
