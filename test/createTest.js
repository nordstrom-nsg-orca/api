const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const createFunction = require('../src/crud.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/json/create.json', 'utf8'));

describe('Testing create endpoint', () => {
  it('Empty body request', async() => {
    let eventData = data;
    eventData.body = "{}";
    let response = await createFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(400);
  });
  it('Successful Create', async() => {
    let response = await createFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });
  it('Bad body request', async() => {
    let eventData = data;
    eventData.body = "{\"other\":  \"Testing create\"}";
    let response = await createFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(400);
  });
});
