'use strict';

const auth = require('./common/auth.js');
const aws = require('aws-sdk');
const corsHeaders = require('./common/headers.js');

const apiGateway = new aws.APIGateway({
  region: 'us-west-2',
  apigateway: '2015-07-09'
});

exports.handler = (event, context, callback) => {
  let token = auth.verifyToken(event.headers.Authorization);
  const headers = corsHeaders.verifyOrigin(event.headers.origin);
  token.then(data => {
    if (!data.valid) {
      context.succeed({
        "statusCode": 403,
        "headers": headers,
        "body": JSON.stringify({"msg": "token invalid"})
      });
    }
  });

  apiGateway.getApiKeys({includeValues: true, nameQuery: 'cloudDBAPI'}, (err, data) => {
    if(err) console.log(err);
    else {
      const response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({apiKey: data.items[0].value})
      }
      // callback(null, response);
      context.succeed(response);
    }
  });


}
