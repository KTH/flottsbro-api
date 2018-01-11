/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackApiKeysConfig = require('../lib/unpackApiKeysConfig')

const uriOne = '?name=devClient&apiKey=1234&scope=write&scope=read'
const uriTwo = '?name=other&apiKey=5678&scope=read'

describe('unpackApiKeysConfig', function () {
  it('can decode a single API key', function () {
    process.env.API_KEY = uriOne

    const obj = unpackApiKeysConfig('API_KEY', undefined)
    expect(obj[0].name).to.equal('devClient')
    expect(obj[0].apiKey).to.equal('1234')
    expect(obj[0].scope[0]).to.equal('write')
    expect(obj[0].scope.length).to.equal(2)

    process.env.API_KEY = undefined
  })

  it('can decode two API keys', function () {
    process.env['API_KEY_0'] = uriOne
    process.env['API_KEY_1'] = uriTwo

    const obj = unpackApiKeysConfig('API_KEY', undefined)

    expect(obj[0].name).to.equal('devClient')
    expect(obj[0].apiKey).to.equal('1234')
    expect(obj[0].scope[0]).to.equal('write')
    expect(obj[0].scope[1]).to.equal('read')
    expect(obj[0].scope.length).to.equal(2)
    expect(obj[1].name).to.equal('other')
    expect(obj[1].apiKey).to.equal('5678')
    expect(obj[1].scope[0]).to.equal('read')

    process.env['API_KEY_0'] = undefined
    process.env['API_KEY_1'] = undefined
  })

  it('can fall back to default', function () {
    const obj = unpackApiKeysConfig('no-env-exists', uriOne)
    expect(obj[0].name).to.equal('devClient')
    expect(obj[0].apiKey).to.equal('1234')
    expect(obj[0].scope[0]).to.equal('write')
    expect(obj[0].scope.length).to.equal(2)
  })
})
