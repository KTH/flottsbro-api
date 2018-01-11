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
    let services = yield Deployments.find({service: req.params.clusterName})
    res.json( services )

  } catch (err) {
    log.error(
      `Error while reading deployments for '${req.params.clusterName}'.
      ${err}`
    )
  }
}

