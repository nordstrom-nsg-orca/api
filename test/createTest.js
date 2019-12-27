const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const fs = require('fs');
const fetch = require('node-fetch');
const data = JSON.parse(fs.readFileSync('./test/create.json', 'utf8'));
const domain = 'https://girm9btzs7.execute-api.us-west-2.amazonaws.com/nonprod';

describe('Testing create endpoint', () => {
  const url = domain + '/api/access_item/';

  it('Invalid Token', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data.body),
      headers: {
        Authorization: "Bearer wrongtoken"
      }
    });
    // console.log(response);
    expect(response.status).equal(403);
    // assert.equal(response.status, 403);
  });

  it('Empty body request', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: data.headers.Authorization
      }
    });
    // console.log(response);
    expect(response.status).equal(400);
  });

  it('Bad body request', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({"list_id": 4}),
      headers: {
        Authorization: data.headers.Authorization
      }
    });
    expect(response.status).equal(400);
  });

  it('Expects a successful create API call', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: data.body,
      headers: {
        Authorization: data.headers.Authorization
      }
    });
    let id = await response.json().then(res => {
      return res.id;
    });
    // writes to delete.json for clean up later.
    let deleteData = JSON.parse(fs.readFileSync('./test/delete.json', 'utf8'));
    deleteData.pathParameters.id = id;
    fs.writeFileSync("./test/delete.json", JSON.stringify(deleteData));
    expect(response.status).equal(200);
  });
});
