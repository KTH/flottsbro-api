'use strict'

const { getEnv, typeConversion } = require('./utils')
const urlgrey = require('urlgrey')
const qs = require('qs')

module.exports = function (envVarName, defaultUri, options) {
  let envObj

  // Azure connection string check
  if (!/^[a-z]*:\W\W/.test(getEnv(envVarName, defaultUri))) {
    envObj = urlgrey(generateRedisUrlFromAzure(getEnv(envVarName, defaultUri)))
  } else {
    envObj = urlgrey(getEnv(envVarName, defaultUri))
  }

  if (!/^redis/.test(envObj.protocol())) {
    throw new Error('Redis URI protocol must be redis, got: ' + envObj.protocol())
  }
  if (!envObj.hostname()) {
    throw new Error('Redis requires a hostname')
  }

  const outp = {
    host: envObj.hostname(),
    port: envObj.port()
  }

  if (typeof options === 'object') {
    Object.assign(outp, options)
  }

  if (envObj.queryString) {
    const tmpQuery = qs.parse(envObj.queryString())
    Object.keys(tmpQuery).forEach((key) => {
      if (key === 'ssl' && tmpQuery[key]) {
        // ssl === true
        outp['tls'] = { servername: envObj.hostname() }
        outp['auth_pass'] = envObj.password()
      } else {
        outp[key] = typeConversion(tmpQuery[key])
      }
    })
  }
  return outp
}

function generateRedisUrlFromAzure (obj) {
  try {
    const azure = obj.split(',')
    const host = azure[0]
    const password = azure[1].replace('password=', '')

    let redisUrl = 'redis://:' + encodeURIComponent(password) + '@' + host
    // Add QueryString
    if (azure.length > 2) {
      redisUrl = redisUrl + '?'
      for (let i = 2; i < azure.length; i++) {
        redisUrl = azure.length - 1 === i ? redisUrl + azure[i] : redisUrl + azure[i] + '&'
      }
    }
    return redisUrl
  } catch (e) {
    throw new Error('Fields missing in Azure connection string')
  }
}
