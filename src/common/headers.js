let allowedOrigins;
if (process.env.STAGE === 'prod') {
  allowedOrigins = [
    'https://nsg.nordstrom.net',
  ];
} else {
  allowedOrigins = [
      'http://localhost:3000',
      'https://nsg-nonprod.nordstrom.net',
      'http://nsg-nonprod.nordstrom.net'
  ];
}

module.exports.verifyOrigin = (origin) => {
  if(allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
    }
  } else {
    return {
      "Access-Control-Allow-Origin": allowedOrigins[0],
    }
  }
}
