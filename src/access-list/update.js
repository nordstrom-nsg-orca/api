'use strict';

const validate = require('jsonschema').validate;

const db = require('../db.js');
const { Client } = require('pg');

const client = new Client(db);
client.connect();

const reqSchema= {
  "id": "access-list-update",
  "type": "object",
  "properties": {
    "id": {"type": "integer"},
    "name": {"type": "string"}
  },
  "required": ["id", "name"]
}

exports.update = async(event, context, callback) => {
  const valid = validate(event, reqSchema);
  console.log(event);
  
  if (!valid.valid){
    var errs = [];
    for (var i = 0; i < valid.errors.length; i++)
      errs.push(valid.errors[i].message);

    return {
      statusCode: 400,
      body: errs
    }
  }

  const query = 'UPDATE access_list SET name = $1 WHERE id = $2';
  const values = [event['name'], event['id']];

  try {
    const res = await client.query(query, values);
    console.log(res);
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err
    }
  }
}