const chai = require('chai');
const expect = chai.expect;
const updateFunction = require('../src/crud.js');
const fs = require('fs');
// const data = JSON.parse(fs.readFileSync('./test/json/update.json', 'utf8'));
const data = {
  headers: { origin: "http://localhost:3000" },
  pathParameters: { table: access_item, id: 38 },
  body: "{\"subnet\": \"still testing\"}",
  httpMethod: "PUT"
};

describe('Testing update endpoint', () => {
  it('Successful Update', async () => {
    const response = await updateFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });
  it('Empty body request', async () => {
    const eventData = JSON.parse(JSON.stringify(data));
    eventData.body = '{}';
    const response = await updateFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });
  it('Bad table\'s name', async () => {
    const eventData = JSON.parse(JSON.stringify(data));
    eventData.pathParameters.table = 'other';
    const response = await updateFunction.handler(eventData, { /* context */ });
    expect(response.statusCode).equal(500);
  });
});
