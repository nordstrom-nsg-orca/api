const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const updateFunction = require('../src/update.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/json/update.json', 'utf8'));

describe('Testing update endpoint', () => {

  it('Successful Update', async() => {
    let response = await updateFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });

  it('Empty body request', async() => {
    const eventData = {pathParameters: data.pathParameters, body: "{}"};
    let response = await updateFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });

  it('Bad table\'s name', async() => {
    let eventData = data;
    eventData.pathParameters.table = 'other';
    let response = await updateFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });

});
