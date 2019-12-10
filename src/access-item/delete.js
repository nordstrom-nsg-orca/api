'use strict';

const validate = require('jsonschema').validate;

const { Client } = require('pg');
const db = require('../db.js');
const client = new Client(db);
client.connect();

const reqSchema= {
  "id": "access-list-delete",
  "type": "object",
  "properties": {
    "id": {"type": "integer"}
  },
  "required": ["id"]
}

exports.delete = async(event, context, callback) => {
  const valid = validate(event, reqSchema);
  
  if (!valid.valid){
    var errs = [];
    for (var i = 0; i < valid.errors.length; i++)
      errs.push(valid.errors[i].message);

    return {
      statusCode: 400,
      body: errs
    }
  }


  const query = 'DELETE FROM access_item WHERE id = $1';
  const values = [event['id']];

  try {
    const res = await client.query(query, values);
    
    if (res.rowCount == 0)
      return {
        statusCode: 400,
        body: "No item found with id " + event['id']
      }

    return {
      statusCode: 200,
      body: {
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