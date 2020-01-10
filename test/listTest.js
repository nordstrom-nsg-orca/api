const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const listFunction = require('../src/crud.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/json/list.json', 'utf8'));
console.log(process.env.NODE_ENV);

describe('Testing list endpoint', () => {

  it('Successful List', async() => {
    let response = await listFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });

  it('Bad table\'s name', async() => {
    let eventData = data;
    eventData.pathParameters.table = 'other';
    let response = await listFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });

});
