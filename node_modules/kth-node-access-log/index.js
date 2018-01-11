'use strict'

const morgan = require('morgan')

const stripHeader = require('./stripHeader')

const defaults = {
  useAccessLog: false,
  stripHeaders: [
    'x-forwarded-for',
    'referer'
  ],
  format: ':remote-addr - :x-forwarded-for :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referer" ":user-agent"',
  morganOptions: {}
}

/**
 * Configures the access log. At minimum, ensure options.enabled is set to true.
 * @param {object} options
 * @return {function}
 */
module.exports = function (options) {
  options = Object.assign({}, defaults, options)

  if (!options.useAccessLog) {
    return function (req, res, next) { next() }
  }

  options.stripHeaders.forEach((header) => {
    morgan.token(header, (req) => {
      return stripHeader(req.get(header))
    })
  })

  return morgan(options.format, options.morganOptions)
}
