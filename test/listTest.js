const chai = require('chai');
const expect = chai.expect;
const listFunction = require('../src/crud.js');
const data = {
  headers: { origin: 'http://localhost:3000' },
  httpMethod: 'GET',
  pathParameters: { table: 'acl_view_json' }
};

describe('Testing list endpoint', () => {
  it('Successful List', async () => {
    const response = await listFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });
  it('Bad table\'s name', async () => {
    const eventData = data;
    eventData.pathParameters.table = 'other';
    const response = await listFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });
});
