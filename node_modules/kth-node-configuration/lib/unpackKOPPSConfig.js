'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')

module.exports = function (envVarName, defaultUri, options) {
  const envObj = urlgrey(getEnv(envVarName, defaultUri))

  if (!/^http[s]*/.test(envObj.protocol())) {
    throw new Error('Node API URI protocol must be http or https, got: ' + envObj.protocol())
  }

  const outp = {
    https: envObj.protocol() === 'https',
    // Netscaler doesn't answer https calls properly if we pass the port to kth-node-api-call
    host: envObj.hostname(),
    basePath: envObj.path()
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
