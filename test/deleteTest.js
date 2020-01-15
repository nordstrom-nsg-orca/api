const chai = require('chai')
const expect = chai.expect
const deleteFunction = require('../src/crud.js')
const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./test/json/delete.json', 'utf8'))

describe('Testing delete endpoint', () => {
  it('Successful Delete', async () => {
    const response = await deleteFunction.handler(data, { /* context */ })
    expect(response.statusCode).equal(200)
  })
  it('Bad table\'s name', async () => {
    const eventData = data
    eventData.pathParameters.table = 'other'
    const response = await deleteFunction.handler(data, { /* context */ })
    expect(response.statusCode).equal(500)
  })
})
