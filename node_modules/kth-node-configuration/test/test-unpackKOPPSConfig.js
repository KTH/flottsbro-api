/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackKOPPSConfig = require('../lib/unpackKOPPSConfig')

const testURI = 'http://kopps-r.referens.sys.kth.se/api/kopps/v2/'
const testURIWithSSL = 'https://kopps-r.referens.sys.kth.se/api/kopps/v2/'
const failProtocol = 'mailto://'

describe('unpackKOPPSConfig', function () {
  it('can decode a KOPPS URI from fallback URI', function () {
    const obj = unpackKOPPSConfig('no-env-exists', testURI)
    expect(obj.https).to.equal(false)
    expect(obj.host).to.equal('kopps-r.referens.sys.kth.se')
    expect(obj.port).to.equal(undefined)
    expect(obj.basePath).to.equal('/api/kopps/v2/')
  })

  it('can decode a KOPPS URI from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackKOPPSConfig('TEST_ENV_NOW_HERE')
    expect(obj.https).to.equal(false)
    expect(obj.host).to.equal('kopps-r.referens.sys.kth.se')
    expect(obj.port).to.equal(undefined)
    expect(obj.basePath).to.equal('/api/kopps/v2/')
  })

  it('can decode a KOPPS URI from fallback URI and merge with options', function () {
    const obj = unpackKOPPSConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.https).to.equal(false)
    expect(obj.host).to.equal('kopps-r.referens.sys.kth.se')
    expect(obj.port).to.equal(undefined)
    expect(obj.basePath).to.equal('/api/kopps/v2/')
    expect(obj.extraOption).to.equal(true)
  })

  it('should not expose protocol property', function () {
    const obj = unpackKOPPSConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('should not expose port if https', function () {
    const obj = unpackKOPPSConfig('no-env-exists', testURIWithSSL)
    expect(obj.port).to.equal(undefined)
    expect(obj.https).to.equal(true)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackKOPPSConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
