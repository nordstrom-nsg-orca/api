'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();

exports.create = async(event, context) => {
	const params = {
		TableName: process.env.DYNAMODB_TABLE
	};
	
	try {
		const res = await dynamoDb.scan(params).promise();
		console.log(JSON.stringify(res));
		return {
			statusCode: res.statusCode,
			body: JSON.stringify(res.Items)
		}
	} catch(err) {
		console.error(err)
		return {
			statusCode: err.statusCode || 501,
			headers: {'Content-Type': 'text/plain' },
			body: 'Couldn\'t create item',
		}
	}
}