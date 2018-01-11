'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')

module.exports = function (envVarName, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  if (!/^smtp[s]*/.test(envObj.protocol())) {
    throw new Error('SMTP URI protocol must be smtp or smtps, got: ' + envObj.protocol())
  }

  const outp = {
    host: envObj.hostname(),
    secure: envObj.protocol() === 'smtps',
    port: envObj.port()
  }

  if (envObj.password() || envObj.username()) {
    outp['auth'] = {
      user: envObj.username(),
      pass: envObj.password()
    }
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (envObj.queryString) {
    var tmpQuery = envObj.query()
    Object.keys(tmpQuery).forEach((key) => {
      outp[key] = typeConversion(tmpQuery[key])
    })
  }
  return outp
}
