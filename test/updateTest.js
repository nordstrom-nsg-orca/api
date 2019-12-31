const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const updateFunction = require('../src/update.js');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/update.json', 'utf8'));

describe('Testing update endpoint', () => {

  it('Successful Update', async() => {
    let response = await updateFunction.handler(data, { /* context */ });
    expect(response.statusCode).equal(200);
  });

});
