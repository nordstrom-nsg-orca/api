'use strict';

const uuid = require('uuid');
const { DynamoDB } = require('aws-sdk');

const dynamoDb = new DynamoDB();

exports.create = async(event, context) => {
	
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Item: {
			'id': { S: uuid.v1() },
			'prefix-list': { S: 'HELLLLLO' }
		}
	};
	
	try {
		const res = await dynamoDb.putItem(params).promise();
		console.log(JSON.stringify(res));
		return res;
	} catch(err) {
		console.error(err)
		return {
			statusCode: err.statusCode || 501,
			headers: {'Content-Type': 'text/plain' },
			body: 'Couldn\'t create item',
		}
	}
}