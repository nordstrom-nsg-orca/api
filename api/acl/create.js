'use strict';

const uuid = require('uuid');
const { DynamoDB } = require('aws-sdk');

const dynamoDb = new DynamoDB.DocumentClient();

exports.create = async(event, context) => {

	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Item: {
			'id': uuid.v1(),
			'prefix-list': event['prefix-list'],
			'ips': JSON.stringify(event.ips)
		}
	};

	try {
		const res = await dynamoDb.put(params).promise();
		return { statusCode: 200 };
	} catch(err) {
		console.error(err)
		return {
			statusCode: err.statusCode || 501,
			headers: {'Content-Type': 'text/plain' },
			body: 'Couldn\'t create item',
		}
	}
}