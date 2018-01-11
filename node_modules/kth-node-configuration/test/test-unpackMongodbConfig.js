/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackMongodbConfig = require('../lib/unpackMongodbConfig')

const testURI = 'mongodb://username@email.com:password@mongohost:27017/innovation?ssl=false'
const failProtocol = 'http://mongohost:27017/innovation'

describe('unpackMongodbConfig', function () {
  it('can decode a Mongodb URI from fallback URI', function () {
    const obj = unpackMongodbConfig('no-env-exists', testURI)
    expect(obj.username).to.equal('username@email.com')
    expect(obj.password).to.equal('password')
    expect(obj.uri).to.equal(testURI)
    expect(obj.ssl).to.equal(false)
  })

  it('can decode a Mongodb URI from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackMongodbConfig('TEST_ENV_NOW_HERE')
    expect(obj.username).to.equal('username@email.com')
    expect(obj.password).to.equal('password')
    expect(obj.uri).to.equal(testURI)
    expect(obj.ssl).to.equal(false)
  })

  it('can decode a Mongodb URI from fallback URI and merge with options', function () {
    const obj = unpackMongodbConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.username).to.equal('username@email.com')
    expect(obj.password).to.equal('password')
    expect(obj.uri).to.equal(testURI)
    expect(obj.ssl).to.equal(false)
    expect(obj.extraOption).to.equal(true)
  })

  it('should not expose protocol property', function () {
    const obj = unpackMongodbConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackMongodbConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
