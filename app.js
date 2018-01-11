'use strict'
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}

const config = require('./server/configuration').server
const server = require('./server/server')
const log = require('kth-node-log')

/* ****************************
 * ******* SERVER START *******
 * ****************************
 */
module.exports = server.start({
  port: config.port,
  logger: log
})
