/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackNodeApiConfig = require('../lib/unpackNodeApiConfig')

const testURI = 'http://node-api:3001/api/node'
const testURIWithSSL = 'https://node-api:3001/api/node'
const failProtocol = 'mailto://'

describe('unpackNodeApiConfig', function () {
  it('can decode a Mongodb URI from fallback URI', function () {
    const obj = unpackNodeApiConfig('no-env-exists', testURI)
    expect(obj.https).to.equal(false)
    expect(obj.host).to.equal('node-api')
    expect(obj.port).to.equal(3001)
    expect(obj.proxyBasePath).to.equal('/api/node')
  })

  it('can decode a Mongodb URI from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackNodeApiConfig('TEST_ENV_NOW_HERE')
    expect(obj.https).to.equal(false)
    expect(obj.host).to.equal('node-api')
    expect(obj.port).to.equal(3001)
    expect(obj.proxyBasePath).to.equal('/api/node')
  })

  it('can decode a Mongodb URI from fallback URI and merge with options', function () {
    const obj = unpackNodeApiConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.https).to.equal(false)
    expect(obj.host).to.equal('node-api')
    expect(obj.port).to.equal(3001)
    expect(obj.proxyBasePath).to.equal('/api/node')
    expect(obj.extraOption).to.equal(true)
  })

  it('should not expose protocol property', function () {
    const obj = unpackNodeApiConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('should not expose port if https', function () {
    const obj = unpackNodeApiConfig('no-env-exists', testURIWithSSL)
    expect(obj.port).to.equal(undefined)
    expect(obj.https).to.equal(true)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackNodeApiConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
