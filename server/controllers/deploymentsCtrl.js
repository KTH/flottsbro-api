'use strict'

const Deployments = require('../models').deployments.Deployments
const co = require('co')
const log = require('kth-node-log')

module.exports = {
  getLatestForApplication: co.wrap(getLatestForApplication),
  getLatestByClusterName: co.wrap(getLatestByClusterName),
}

function* getLatestForApplication(request, response, next) {

  log.debug(`Getting latest deployments for cluster '${request.params.clusterName}' and application '${request.params.applicationName}'.`)

  try {

    log.debug(`Collection name: '${Deployments.collection.collectionName}'`)
    log.debug(`Searching for '${request.params.applicationName}' in cluster '${request.params.clusterName}'.`)

    let deployments = yield Deployments.find(
      {
        "cluster.cluster_name": request.params.clusterName,
        "application_name": request.params.applicationName
      }
    );


    if (deployments) {
      for (let i = 0; i < deployments.length; i++) {

        const application = getApplication(deployments[i]);

        if (application) {
          response.json(application)
          return
        }
      }

    }

    response.status(404).json({"Message" : `No application '${request.params.applicationName}' found in cluster '${request.params.clusterName}'.`});

  } catch (err) {
    log.error(`Error while reading deployments for '${request.params.clusterName}'`, err)
    response.status(503).json({"Message" : `Unexpected error when trying to read deployment data for '${request.params.applicationName}' in cluster '${request.params.clusterName}'.`});
  }

}
function* getLatestByClusterName(request, response, next) {

  log.debug(`Getting latest deployments for cluster '${request.params.clusterName}'.`)

  try {

    log.debug(`Collection name: '${Deployments.collection.collectionName}'`)
    log.debug(`Searching for applications in cluster '${request.params.clusterName}'.`)

    let deployments = yield Deployments.find(
      {
        "cluster.cluster_name": request.params.clusterName
      }
    );

    let result = []

    if (deployments && deployments.count) {
      for (let i = 0; i < deployments.length; i++) {

        const application = getApplication(deployments[i]);

        if (application) {
          result.push(application)
        }

      }
    } else {
      response.status(404).json({"Message" : `No deployed applications found in cluster '${request.params.clusterName}'.`});
    }

    response.json(result)

  } catch (err) {
    log.error(`Error while reading deployments for '${request.params.clusterName}'`, err)
    response.status(503).json({"Message" : `Unexpected error when trying to read deployment data for cluster '${request.params.clusterName}'.`});
  }
}

function getApplication(deployment) {

  let application = {}

  // Set application 
  application.applicationName = deployment.application_name;
  application.clusterName = deployment.cluster.cluster_name;

  // Set version
  const images = deployment.services[0].image;
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    if (image.semver_version === undefined) {
      application.version = image.static_version
    } else {
      application.version = image.semver_version
    }
  }

  // Set labels
  const labels = deployment.services[0].labels;
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]
    if (label.label === "se.kth.importance") {
      application.importance = label.value
    }
    if (label.label === "se.kth.slackChannels") {
      application.slackChannels = label.value
    }
  }

  // Set deployment labels
  const deploy_labels = deployment.services[0].deploy_labels;
  for (let i = 0; i < deploy_labels.length; i++) {
    const deploy_label = deploy_labels[i]
    if (deploy_label.label === "com.df.servicePath") {
      application.path = deploy_label.value
    }
    if (deploy_label.label === "com.df.servicePath") {
      application.path = deploy_label.value
    }
  }

  return application

}


