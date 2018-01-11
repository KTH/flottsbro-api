/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackSequelizeConfig = require('../lib/unpackSequelizeConfig')

const testURI = 'sqlite://path/to/my/db/database.sqlite'
const failProtocol = 'smurf://path/to/my/db/database.sqlite'

describe('unpackSequelizeConfig', function () {
  it('can decode a Sequelize config from fallback URI', function () {
    const obj = unpackSequelizeConfig('no-env-exists', undefined, testURI)
    expect(obj.dialect).to.equal('sqlite')
    expect(obj.storage).to.not.be.null
  })

  it('can decode a Sequelize config from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE')
    expect(obj.dialect).to.equal('sqlite')
    expect(obj.storage).to.not.be.null
  })

  it('can override pool config', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackSequelizeConfig('TEST_ENV_NOW_HERE', undefined, undefined, {pool: {max: 1}})
    expect(obj.pool.max).to.equal(1)
  })

  it('should fetch password', function () {
    process.env['PWD'] = 'mypassword'
    const obj = unpackSequelizeConfig('no-env-exists', 'PWD', testURI)
    expect(obj.password).to.equal('mypassword')
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
