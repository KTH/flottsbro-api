const {
  safeGet
} = require('safe-utils')
const {
  getEnv,
  unpackMongodbConfig,
  unpackApiKeysConfig
} = require('kth-node-configuration')

module.exports = {
  port: 3001,

  proxyPrefixPath: {
    uri: '/api/pipeline'
  },

  db: unpackMongodbConfig('MONGODB_CONNECTION_STRING', getEnv('MONGODB_CONNECTION_STRING')),

  collection: getEnv('MONGODB_COLLECTION', 'flottsbro-api'),

  api_keys: unpackApiKeysConfig('API_KEYS', getEnv('API_KEYS')),

  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug')
    }
  }
}