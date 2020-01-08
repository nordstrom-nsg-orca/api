'use strict';

const auth = require('./common/auth.js');
const aws = require('aws-sdk');
const uuid = require('uuid');
const apiGateway = new aws.APIGateway({
  region: 'us-west-2',
  apigateway: '2015-07-09'
});

exports.handler = (event, context, callback) => {
  let token = auth.verifyToken(event.headers.Authorization);
  token.then(data => {
    if (!data.valid) {
      context.succeed({
        "statusCode": 403,
        "body": JSON.stringify({"msg": "token invalid"})
      });
    }
  });

  apiGateway.getApiKeys({includeValues: true, nameQuery: 'cloudDBAPI'}, (err, data) => {
    if(err) console.log(err);
    else {
      const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify({apiKey: data.items[0].value})
      }
      // callback(null, response);
      context.succeed(response);
    }
  });


}
