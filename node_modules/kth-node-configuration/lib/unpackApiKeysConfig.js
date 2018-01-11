'use strict'

const { decodeArray } = require('./utils')
const urlgrey = require('urlgrey')
var assert = require('assert')

module.exports = function (envVarName, defaultUri) {
  const inp = decodeArray(envVarName, defaultUri)

  const outp = inp.map(function (item) {
    const tmp = urlgrey(item).query()

    assert(tmp['name'] !== undefined, 'Missing name')
    assert(tmp['apiKey'] !== undefined, 'Missing apiKey')
    assert(tmp['scope'] !== undefined, 'Missing scope')

    // Create an alias because it was misspelled
    tmp['apikey'] = tmp['apiKey']

    if (!Array.isArray(tmp.scope)) {
      tmp.scope = [tmp.scope]
    }
    return tmp
  })

  return outp
}
