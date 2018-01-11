/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackSMTPConfig = require('../lib/unpackSMTPConfig')

const testURI = 'smtp://smtp.kth.se:25'
const testURIWithSSL = 'smtps://username:password@smtp.kth.se:465'
const failProtocol = 'mailto://'

describe('unpackSMTPConfig', function () {
  it('can decode a SMTP URI from fallback URI', function () {
    const obj = unpackSMTPConfig('no-env-exists', testURI)
    expect(obj.host).to.equal('smtp.kth.se')
    expect(obj.auth).to.equal(undefined)
    expect(obj.port).to.equal(25)
  })

  it('can decode a SMTP URI from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackSMTPConfig('TEST_ENV_NOW_HERE')
    expect(obj.host).to.equal('smtp.kth.se')
    expect(obj.auth).to.equal(undefined)
    expect(obj.port).to.equal(25)
  })

  it('can decode a SMTP URI from fallback URI and merge with options', function () {
    const obj = unpackSMTPConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.host).to.equal('smtp.kth.se')
    expect(obj.auth).to.equal(undefined)
    expect(obj.port).to.equal(25)
    expect(obj.extraOption).to.equal(true)
  })

  it('should not expose protocol property', function () {
    const obj = unpackSMTPConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('can handle auth', function () {
    const obj = unpackSMTPConfig('no-env-exists', testURIWithSSL)
    expect(obj.auth.pass).to.equal('password')
    expect(obj.auth.user).to.equal('username')
  })

  it('sets secure on smtps', function () {
    const obj = unpackSMTPConfig('no-env-exists', testURIWithSSL)
    expect(obj.secure).to.equal(true)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackSMTPConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
