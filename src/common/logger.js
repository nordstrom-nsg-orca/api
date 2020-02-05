const SplunkLogger = require('splunk-logging').Logger;

const config = {
  url: 'http-inputs-nordstrom.splunkcloud.com',
  token: `${process.env.SPLUNK_TOKEN}`,
  port: 443
};

const Logger = new SplunkLogger(config);

const metadata = {
  sourcetype: 'orca_api',
  index: 'main'
};

module.exports.log = (message, severity = 'info') => {
  const payload = {
    message: message,
    metadata: metadata,
    severity: severity
  };
  Logger.send(payload, function (err, resp, body) {
    if (err)
      console.log(err);
  });
};
