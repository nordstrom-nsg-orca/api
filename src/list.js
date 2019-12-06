'use strict';

const uuid = require('uuid');
const { DynamoDB } = require('aws-sdk');

const dynamoDb = new DynamoDB.DocumentClient();

exports.list = async(event, context) => {
	const params = { TableName: process.env.DYNAMODB_TABLE };
	
	try {
		const res = await dynamoDb.scan(params).promise();
		
		// res.Items.forEach(element => {
		// 	console.log(JSON.parse(element.ips))
		// })
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