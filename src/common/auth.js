const okta = require('@okta/jwt-verifier')
const Verifier = new okta({
  issuer: 'https://nordstrom.oktapreview.com/oauth2/ausmbgds36nqid3rW0h7'
})

module.exports.verifyToken = async (token) => {
  if (token.startsWith('Bearer ')) {
    token = token.substr(7)
  }

  let jwt
  try {
    jwt = await Verifier.verifyAccessToken(token, 'ReactApp')
    return {
      valid: true,
      jwt: jwt
    }
  } catch (err) {
    return {
      valid: false,
      err: err
    }
  }
}
