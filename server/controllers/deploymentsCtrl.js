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

        const application = toApplication(deployments[i]);

        if (application) {
          response.json(application)
          return
        }
      }

    }

    response.status(404).json({ "Message": `No application '${request.params.applicationName}' found in cluster '${request.params.clusterName}'.` });

  } catch (err) {
    log.error(`Error while reading deployments for '${request.params.clusterName}'`, err)
    response.status(503).json({ "Message": `Unexpected error when trying to read deployment data for '${request.params.applicationName}' in cluster '${request.params.clusterName}'.` });
  }

}
function* getLatestByClusterName(request, response, next) {

  log.debug(`Getting latest deployments for cluster '${request.params.clusterName}'.`)

  try {

    log.debug(`Collection name: '${Deployments.collection.collectionName}'`)
    log.debug(`Searching for applications in cluster '${request.params.clusterName}'.`)

    let deployments = yield Deployments.find().
      where("cluster.cluster_name").equals(request.params.clusterName).
      limit(100)

    let result = []

    if (deployments) {
      for (let i = 0; i < deployments.length; i++) {

        const application = toApplication(deployments[i]);

        if (application) {
          result.push(application)
        }

      }
      response.json(result)

    } else {
      response.status(404).json({ "Message": `No deployed applications found in cluster '${request.params.clusterName}'.` });
    }


  } catch (err) {
    log.error(`Error while reading deployments for '${request.params.clusterName}'`, err)
    response.status(503).json({ "Message": `Unexpected error when trying to read deployment data for cluster '${request.params.clusterName}'.` });
  }
}

function toApplication(deployment) {

  let application = {}

  // Set application 
  application.applicationName = deployment.application_name;

  application.created = deployment.created;
  application.clusterName = deployment.cluster.cluster_name;

  // Set version
  const image = deployment.services[0].image;

  if (image.semver_version) {
    application.version = image.semver_version
  } else {
    application.version = image.static_version
  }

  // Set deployment labels
  const deploy_labels = deployment.services[0].deploy_labels;

  for (let i = 0; i < deploy_labels.length; i++) {

    const deploy_label = deploy_labels[i]

    if (deploy_label.label === "com.df.servicePath") {
      application.path = deploy_label.value
    }

    if (deploy_label.label === "com.df.servicePath") {
      if (application.applicationName === "tamarack") {
        application.path = "/"
      } else {
        application.path = deploy_label.value
      }
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

    if (label.label === "se.kth.monitorUrl") {
      application.monitorUrl = label.value
    }

    if (label.label === "se.kth.publicName.swedish") {
      application.publicName.swedish = label.value
    }

    if (label.label === "se.kth.publicName.english") {
      application.publicName.english = label.value
    }
    
    if (label.label === "se.kth.description.swedish") {
      application.description.swedish = label.value
    }
    
    if (label.label === "se.kth.description.english") {
      application.description.english = label.value
    }
    
  }

  return application

}


