/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackSequelizeConfig = require('../lib/unpackSequelizeConfig')

const testInstanceURI = 'mssql://username:password@db.test.com/InstanceName/DbName'
const testDbURI = 'mssql://username:password@db.test.com:1234/DbName'
const failProtocol = 'http://path/to/my/db/database.crap'

describe('unpackSQLServerConfig', function () {
  it('can decode a SQLServer config from fallback URI', function () {
    const obj = unpackSequelizeConfig('no-env-exists', undefined, testInstanceURI)
    expect(obj.dialect).to.equal('mssql')
    expect(obj.dbName).to.equal('DbName')
  })

  it('can decode a SQLServer config from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testDbURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE')
    expect(obj.dialect).to.equal('mssql')
    expect(obj.dbName).to.equal('DbName')
    expect(obj.username).to.equal('username')
    expect(obj.host).to.equal('db.test.com')
    expect(obj.port).to.equal(1234)
  })

  it('should not expose protocol property', function () {
    const obj = unpackSequelizeConfig('no-env-exists', undefined, testDbURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackSequelizeConfig('no-env-exists', undefined, failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
