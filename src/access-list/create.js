'use strict';

const validate = require('jsonschema').validate;

const db = require('../db.js');
const { Client } = require('pg');

const client = new Client(db);
client.connect();

const reqSchema= {
  "id": "access-list-delete",
  "type": "object",
  "properties": {
    "name": {"type": "string"}
  },
  "required": ["name"]
}

exports.create = async(event, context) => {
  const valid = validate(event, reqSchema);
  
  if (!valid.valid) {
    var errs = [];
    for (var i = 0; i < valid.errors.length; i++)
      errs.push(valid.errors[i].message);

    return {
      statusCode: 400,
      body: errs
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