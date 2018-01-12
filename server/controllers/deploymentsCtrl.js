'use strict'

const Deployments = require('../models').deployments.Deployments
const co = require('co')
const log = require('kth-node-log')

module.exports = {
  getLatestByClusterName: co.wrap(getLatestByClusterName),
}

function * getLatestByClusterName (req, res, next) {
  
  log.debug(`Getting latest deployments for cluster '${req.params.clusterName}'.`)

  try {
    log.debug(`Collection name: '${Deployments.collection.collectionName}'`)
    
    let services = yield Deployments.findOne()
  
    log.debug(`Service: '${services}'`)
  
    res.json( services )

  } catch (err) {
    log.error( `Error while reading deployments for '${req.params.clusterName}'.
                ${err}`
    )
  }
}

