const chai = require('chai');
const expect = chai.expect;
const crud = require('../src/crud.js');

const headers = { origin: 'http://localhost:3000' };
const table = 'api_test';

describe('Testing create endpoint', function () {
  const request = {
    headers: headers,
    pathParameters: { table: table },
    body: JSON.stringify({ required_column: 'hey' }),
    httpMethod: 'POST'
  };

  it('Successful Create', async function () {
    const response = await crud.handler(request, {});
    const body = JSON.parse(response.body);

    expect(response.statusCode).equal(200);
    expect(body).to.have.property('id');
  });

  it('Bad request', async function () {
    request.body = JSON.stringify({ other: 'testing' });
    const response = await crud.handler(request, {});
    const body = JSON.parse(response.body);

    expect(response.statusCode).equal(400);
    expect(body).to.have.property('err');
    expect(body.err[0]).equal('requires property "required_column"');
  });
});

describe('Testing list endpoint', function () {
  const request = {
    headers: headers,
    pathParameters: { table: table },
    httpMethod: 'GET'
  };

  it('Successful List', async function () {
    const response = await crud.handler(request, {});

    expect(response.statusCode).equal(200);
  });

  it('Bad table\'s name', async function () {
    request.pathParameters.table = 'other';
    const response = await crud.handler(request, {});

    expect(response.statusCode).equal(400);
  });
});

describe('Testing update endpoint', function () {
  const request = {
    headers: headers,
    pathParameters: { table: table },
    httpMethod: 'PUT',
    body: JSON.stringify({ optional_column: 'new value' })
  };

  it('Successful Update', async function () {
    const req = { headers: headers, pathParameters: { table: table }, httpMethod: 'GET' };
    const res = await crud.handler(req, {});
    const id = JSON.parse(res.body)[0].id;

    request.pathParameters.id = id;
    const response = await crud.handler(request, {});

    expect(response.statusCode).equal(200);
  });
});

describe('Testing delete endpoint', function () {
  const request = {
    headers: headers,
    pathParameters: { table: table },
    httpMethod: 'DELETE'
  };

  it('Successful Delete', async function () {
    const req = { headers: headers, pathParameters: { table: table }, httpMethod: 'GET' };
    const res = await crud.handler(req, {});
    const id = JSON.parse(res.body)[0].id;

    request.pathParameters.id = id;
    const response = await crud.handler(request, {});

    expect(response.statusCode).equal(200);
  });
});
