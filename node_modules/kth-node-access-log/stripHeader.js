'use strict'

const strip = require('./strip')

/**
 * Parses an object (presumably HTTP headers) and finds the first match.
 * If a match is found and assuming it is a URL, it strips the query string.
 * @param {string} header
 * @return {string}
 */
module.exports = function (header) {
  const emptyValue = '-'

  if (typeof header !== 'string' || header === '') {
    return emptyValue
  }

  return strip(header, '?')
}
