const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const deleteFunction = require('../src/delete.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/delete.json', 'utf8'));

describe('Testing delete endpoint', () => {

  it('Successful Delete', async() => {
    let response = await deleteFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });

  it('Bad table\'s name', async() => {
    let eventData = data;
    eventData.pathParameters.table = 'other';
    let response = await deleteFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(500);
  });

});
