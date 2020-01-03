const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const createFunction = require('../src/create.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/create.json', 'utf8'));

describe('Testing create endpoint', () => {
  it('Empty body request', async() => {
    const eventData = {pathParameters: data.pathParameters, body: "{}"};
    let response = await createFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(400);
  });
  it('Successful Create', async() => {
    let response = await createFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });
  it('Bad body request', async() => {
    const eventData = {pathParameters: data.pathParameters, body: "{\"other\":  \"Testing create\"}"};
    let response = await createFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(400);
  });
});
