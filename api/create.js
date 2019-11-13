'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();

// module.exports.create(event, context, callback) => {
// 	const params = {
// 		TableName: process.env.DYNAMODB_TABLE,
// 		Item: {
// 			id: uuid.v1(),
// 			prefix-list: "HELLLLLO"
// 		}
// 	};

// 	dynamoDb.put(params, (error) => {
// 		if (error) {
// 			console.log(error);
// 			callback(null, {
// 				statusCode: error.statusCode || 501,
// 				headers: {'Content-Type': 'text/plain' },
// 				body: 'Couldn\'t create item',
// 			});
// 			return;
// 		}
// 	})
// };

exports.create = async(event, context) => {
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Item: {
			'id': {N: '1'},
			'prefix-list': {S: 'HELLLLLO'}
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