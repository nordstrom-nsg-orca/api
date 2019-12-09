'use strict';

const db = require('../db.js');
const { Client } = require('pg');

const client = new Client(db);
client.connect();

exports.create = async(event, context, callback) => {
  console.log(event);
  

  if (typeof event['access-list'] == 'undefined' || event['access-list'].length == 0) {
    return {
      statusCode: 500, 
      body: "invalid or missing access-list param"
    }
  }

  const query = 'INSERT INTO access_list(name) VALUES ($1) RETURNING id';
  const values = [event['access-list']];

  try {
    const res = await client.query(query, values);
    console.log(res);
    return {
      statusCode: 200,
      body: {
        id: res.rows[0].id
      }
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err
    }
  }
}