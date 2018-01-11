'use strict'

/**
 * Searches for token in value and optionally strips the right-hand part if found.
 * @param {string} value
 * @param {string} token
 * @return {string}
 */
module.exports = function (value, token) {
  const index = value.indexOf(token)

  if (index === -1) {
    return value
  }

  return value.substring(0, index)
}
