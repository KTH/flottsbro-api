'use strict'

module.exports = function (browserConfig, paths) {
  return function (req, res, next) {
    try {
      const outp = []
      outp.push('(function () {')
      outp.push('    window.config = ' + JSON.stringify(browserConfig))
      outp.push('    window.paths = ' + JSON.stringify(paths))
      outp.push('})()')
      return res.type('application/javascript').send(outp.join('\n'))
    } catch (err) {
      return next(err)
    }
  }
}
