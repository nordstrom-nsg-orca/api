const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const updateFunction = require('../src/list.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/list.json', 'utf8'));

describe('Testing list endpoint', () => {

  it('Successful List', async() => {
    let response = await updateFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });

  it('Bad table\'s name', async() => {
    let eventData = data;
    eventData.pathParameters.table = 'other';
    let response = await updateFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });

});
