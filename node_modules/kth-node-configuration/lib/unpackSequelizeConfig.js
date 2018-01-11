'use strict'

const { getEnv } = require('./utils')
const urlgrey = require('urlgrey')
const unpackSqliteConfig = require('./unpackSqliteConfig')
const unpackSQLServerConfig = require('./unpackSQLServerConfig')

// TODO Make override possible
const defaultOptions = {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}

module.exports = function (envVarName, envPassword, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  let outp

  if (unpackSqliteConfig.canUnpack(envObj)) {
    outp = unpackSqliteConfig.unpack(envVarName, defaultUri)
  } else if (unpackSQLServerConfig.canUnpack(envObj)) {
    outp = unpackSQLServerConfig.unpack(envVarName, defaultUri)
  } else {
    throw new Error('Sequelize could not handle protocol: ', envObj.protocol())
  }

  outp = Object.assign(outp, defaultOptions)

  // Add password to object
  outp.password = getEnv(envPassword)

  if (typeof options === 'object') {
    outp = Object.assign(outp, options)
  }

  return outp
}
