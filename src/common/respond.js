const { log } = require('./logger.js');
module.exports.respond = (statusCode, msg, headers, logPayload) => {
  logPayload.statusCode = statusCode;
  const severity = statusCode === 200 ? 'info' : 'error';
  log(logPayload, severity);

  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(msg)
  };
};
