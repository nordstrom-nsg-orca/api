const chai = require('chai')
const expect = chai.expect
const listFunction = require('../src/crud.js')
const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./test/json/list.json', 'utf8'))
console.log(process.env.NODE_ENV)

describe('Testing list endpoint', () => {

  it('Successful List', async () => {
    const response = await listFunction.handler(data, { /* context */ })
    expect(response.statusCode).equal(200)
  })

  it('Bad table\'s name', async () => {
    const eventData = data
    eventData.pathParameters.table = 'other'
    const response = await listFunction.handler(eventData, { /* context */ })
    expect(response.statusCode).equal(500)
  })

})
