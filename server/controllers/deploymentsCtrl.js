"use strict";

const Deployments = require("../models").deployments.Deployments;
const co = require("co");
const log = require("kth-node-log");

module.exports = {
  getLatestForApplication: co.wrap(getLatestForApplication),
  getLatestByClusterName: co.wrap(getLatestByClusterName),
  getLatestByMonitorUrl: co.wrap(getLatestByMonitorUrl)
};

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestByMonitorUrl(request, response, next) {

  let result = undefined;
  let searchPath = decodeURIComponent(request.params.path)

  log.debug(`Getting application in '${request.params.clusterName}' matching path '${request.params.path}'.`);

  let applications = yield getLatestByClusterNameFromDatabase(request.params.clusterName)

  applications.forEach(application => {
    if (application.path && application.path != "/") {
      if (searchPath.startsWith(application.path)) {
        log.info(`${decodeURIComponent(request.params.path)}' starts with ${application.path}, used by ${application.applicationName}.`);
        result = application;
        return;
      }
    }

  });
  if (result) {
    response.json(result);
  } else {
    response.status(404).json({
      Message: `No deployed applications found in cluster '${request.params.clusterName}' starting with path '${request.params.path}'.`
    });
  }
}

/**
 * Gets the latest deployments as an array for a specified cluster name.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestByClusterName(request, response, next) {

  log.debug(`Getting latest deployments for cluster '${request.params.clusterName}'.`);
  log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
  log.debug(`Searching for applications in cluster '${request.params.clusterName}'.`);

  let applications = yield getLatestByClusterNameFromDatabase(request.params.clusterName)

  if (applications == undefined) {
    response.status(503).json({
      Message: `Unexpected error when trying to read deployment data for cluster '${request.params.clusterName}'.`
    });
    return;

  }

  if (applications.length > 0) {
    response.json(applications);
    return;
  }

  response.status(404).json({
    Message: `No deployed applications found in cluster '${request.params.clusterName}'.`
  });

}

/**
 * Gets the latest deployments as an array for a specified cluster name.
 * @param {*} clusterName
 * @param {*} response
 * @param {*} next
 */
function* getLatestByClusterNameFromDatabase(clusterName) {

  let result = undefined;

  try {
    let deployments = yield Deployments.aggregate([{
        $match: {
          "cluster.cluster_name": clusterName
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      {
        $group: {
          _id: "$application_name",
          created: {
            $first: "$created"
          },
          application_name: {
            $first: "$application_name"
          },
          service_file_md5: {
            $first: "$service_file_md5"
          },
          cluster: {
            $first: "$cluster"
          },
          services: {
            $first: "$services"
          }
        }
      },
      {
        $limit: 50
      }
    ]);

    result = [];

    deployments.forEach(deployment => {
      if (!containsApplication(result, deployment)) {
        const application = toApplication(deployment);
        if (application) {
          log.debug(`Added application '${application.applicationName}' to list.`);
          result.push(application);
        }
      }
    });

    log.info(`Found ${result.length} applications deployed in '${clusterName}'.`);

  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'.`, err);
  }

  return result;

}

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplication(request, response, next) {

  log.debug(`Getting latest deployments for cluster '${request.params.clusterName}' and application '${request.params.applicationName}'.`);
  log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
  log.debug(`Searching for '${request.params.applicationName}' in cluster '${request.params.clusterName}'.`);

  let application = yield getLatestForApplicationFromDatabase(request.params.clusterName, request.params.applicationName);

  if (application == undefined) {
    response.status(503).json({
      Message: `Unexpected error when trying to read deployment data for cluster '${request.params.clusterName}' and application '${request.params.clusterName}'.`
    });
    return;
  }

  if (application == "") {
    response.status(404).json({
      Message: `No application '${request.params.applicationName}' found in cluster '${request.params.clusterName}'.`
    });
    return;
  }

  response.json(application)

}

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplicationFromDatabase(clusterName, applicationName) {

  let result = undefined;

  try {

    let deployments = yield Deployments.find({
      "cluster.cluster_name": clusterName,
      application_name: applicationName
    }).sort({
      created: -1
    });

    result = "";

    if (deployments) {
      for (let i = 0; i < deployments.length; i++) {
        const application = toApplication(deployments[i]);

        if (application) {
          log.info(`Found deployment for '${applicationName}' in '${clusterName}'`);
          result = application;
          break;
        }
      }
    }

  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'`, err);
  }

  return result;
}


function containsApplication(results, deployment) {
  let found = false;
  results.forEach(app => {
    if (app.applicationName === deployment.application_name) {
      found = true;
    }
  });
  return found;
}

function toApplication(deployment) {
  let application = {};

  if (!deployment.created) {
    return null;
  }


  // Set application
  application.applicationName = deployment.application_name;

  application.created = deployment.created;

  // Ignore old KOPPS
  if (application.created.toString() == "1539870667.778536") {
    return null;
  }

  application.clusterName = deployment.cluster.cluster_name;

  // Set version
  const image = deployment.services[0].image;

  if (image.semver_version) {
    application.version = image.semver_version;
  } else {
    application.version = image.static_version;
  }

  // Set deployment labels
  const deploy_labels = deployment.services[0].deploy_labels;

  for (let i = 0; i < deploy_labels.length; i++) {
    const deploy_label = deploy_labels[i];

    if (deploy_label.label === "com.df.servicePath") {
      application.path = deploy_label.value;
    }

    if (deploy_label.label === "com.df.servicePath") {
      if (application.applicationName === "tamarack") {
        application.path = "/";
      } else {
        application.path = deploy_label.value;
      }
    }
  }

  // Set labels
  const labels = deployment.services[0].labels;

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];

    if (label.label === "se.kth.importance") {
      application.importance = label.value;
    }

    if (label.label === "se.kth.slackChannels") {
      let channels = label.value;
      channels = channels.replace("-build", "");
      channels = channels.replace("#pipeline-logs", "");
      channels = channels.replace(",", " ");

      application.slackChannels = channels;
    }

    if (label.label === "se.kth.monitorUrl") {
      application.monitorUrl = label.value;
    }

    if (label.label === "se.kth.publicName.swedish") {
      application.publicNameSwedish = label.value;
    }

    if (label.label === "se.kth.publicName.english") {
      application.publicNameEnglish = label.value;
    }

    if (label.label === "se.kth.description.swedish") {
      application.descriptionSwedish = label.value;
    }

    if (label.label === "se.kth.description.english") {
      application.descriptionEnglish = label.value;
    }
  }

  // ignore old application deployments by pattern
  if (application.applicationName == "lms-sync") {
    return null;
  }
  if (application.created.toString() == "1539870667.778536") {
    return null;
  }

  if (application.monitorUrl != undefined) {
    if (application.monitorUrl.includes("test")) {
      return null;
    }
    if (application.monitorUrl.includes("/kopps2/")) {
      return null;
    }

  }

  return application;
}