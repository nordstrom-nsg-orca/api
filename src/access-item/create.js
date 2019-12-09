'use strict';

const db = require('./db.js');
const { Client } = require('pg');

const client = new Client(db);
client.connect();

exports.create = async(event, context) => {
  console.log(event);
  
  if (event['prefix-list'])
    this.createPrefix(event['prefix-list']);
  else
    createItem(event);



}