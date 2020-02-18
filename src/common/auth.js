const Okta = require('@okta/jwt-verifier');
const verifier = new Okta({
  issuer: 'https://nordstrom.oktapreview.com/oauth2/ausg0zujx3faqpGaA0h7'
});

module.exports.verifyToken = async (token) => {
  if (!token)
    return { valid: false, err: { userMessage: 'no auth' } };

  if (token.startsWith('Bearer '))
    token = token.substr(7);

  let jwt;
  try {
    jwt = await verifier.verifyAccessToken(token, 'ReactApp');
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
};
