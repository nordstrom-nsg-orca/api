const Okta = require('@okta/jwt-verifier');
const verifier = new Okta({
  issuer: 'https://nordstrom.oktapreview.com/oauth2/ausg0zujx3faqpGaA0h7'
});

const db = require('./db.js');
const { Client } = require('pg');

module.exports.authorize = async (token) => {
  if (!token)
    return { valid: false, err: { userMessage: 'no auth' } };

  if (token.startsWith('Bearer '))
    return verifyToken(token);
  else if (token.startsWith('Basic '))
    return verifyUser(token);
};

async function verifyToken (token) {
  token = token.substr(7);
  let jwt;
  try {
    jwt = await verifier.verifyAccessToken(token, 'https://nordstrom.oktapreview.com/nauth-oidc-service');

    return {
      valid: true,
      jwt: jwt
    };
  } catch (err) {
    return {
      valid: false,
      err: err
    };
  }
}

async function verifyUser (creds) {
  if (!creds)
    return { valid: false, err: 'No auth', status: 403 };

  let cursor;
  if (creds.startsWith('Basic '))
    creds = creds.substr(5);

  creds = Buffer.from(creds, 'base64').toString();

  const username = creds.split(':')[0];
  const password = creds.split(':')[1];

  const client = new Client(db);
  try {
    await client.connect();
  } catch (err) {
    return {
      valid: false,
      status: 500,
      err: 'database connection error'
    };
  }

  const query = 'SELECT id FROM orca.user WHERE username=$1 and password=$2';
  const values = [username, password];
  try {
    cursor = await client.query(query, values);
  } catch (err) {
    return {
      valid: false,
      status: 400,
      err: 'query error'
    };
  }
  if (cursor.rows.length >= 1) {
    return {
      valid: true,
      status: 200,
      username: username
    };
  }
  return {
    valid: false,
    status: 403,
    err: 'Forbidden'
  };
};
