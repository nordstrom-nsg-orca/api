const chai = require('chai');
const expect = chai.expect;
const createFunction = require('../src/crud.js');
const data = {
  headers: { origin: 'http://localhost:3000' },
  pathParameters: { table: 'access_item' },
  body: '{\"subnet\":  \"Testing create\", \"description\":  \"Testing create\", \"list_id\":  1}',
  httpMethod: 'POST'
};
describe('Testing create endpoint', () => {
  it('Empty body request', async () => {
    const eventData = JSON.parse(JSON.stringify(data));
    eventData.body = '{}';
    const response = await createFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(400);
  });
  it('Successful Create', async () => {
    const response = await createFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });
  it('Bad body request', async () => {
    const eventData = JSON.parse(JSON.stringify(data));
    eventData.body = '{\"other\": \"testing\"}';
    const response = await createFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(400);
  });
});
