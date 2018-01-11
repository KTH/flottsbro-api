'use strict'

/*
  Unpacks URI for local Sqlite config.

  Example: file://path/to/your/sqlite.db
*/

const { getEnv } = require('./utils')
const urlgrey = require('urlgrey')

const _isCorrectURI = (envObj) => /^mssql/.test(envObj.protocol())

module.exports.canUnpack = _isCorrectURI

module.exports.unpack = function (envVarName, defaultUri) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  if (!_isCorrectURI(envObj)) {
    throw new Error('MSSQL URI protocol must be mssql, got: ' + envObj.protocol())
  }

  let tmp = envObj.path().split('/')

  const outp = {
    dbName: tmp[tmp.length - 1],
    instanceName: (tmp.length > 2 ? tmp[1] : undefined),
    username: envObj.username(),
    dialect: 'mssql',
    host: envObj.hostname(),
    port: envObj.port(),
    // Pool added by unpackSequilizeConfig
    dialectOptions: {
      encrypt: true
    }
  }

  return outp
}
