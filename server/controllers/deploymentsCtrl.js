"use strict";

const Deployments = require("../models").deployments.Deployments;
const co = require("co");
const log = require("kth-node-log");

module.exports = {
  getLatestForApplication: co.wrap(getLatestForApplication),
  getLatestByClusterName: co.wrap(getLatestByClusterName)
};

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplication(request, response, next) {
  log.debug(
    `Getting latest deployments for cluster '${
      request.params.clusterName
    }' and application '${request.params.applicationName}'.`
  );

  try {
    log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
    log.debug(
      `Searching for '${request.params.applicationName}' in cluster '${
        request.params.clusterName
      }'.`
    );

    let deployments = yield Deployments.find({
      "cluster.cluster_name": request.params.clusterName,
      application_name: request.params.applicationName
    }).sort({
      created: -1
    })

    if (deployments) {
      for (let i = 0; i < deployments.length; i++) {
        log.debug(
          `Collection name: '${Deployments.collection.collectionName}'`
        );
        const application = toApplication(deployments[i]);

        if (application) {
          log.info(
            `Found deployment for '${request.params.applicationName}' in '${
              request.params.clusterName
            }'`
          );k
          response.json(application);
          return;
        }
      }
    } else {
      log.info(
        `Got null back from : '${Deployments.collection.collectionName}' for '${
          request.params.clusterName
        }'`
      );
    }

    log.info(
      `No application '${request.params.applicationName}' found in cluster '${
        request.params.clusterName
      }'.`
    );
    response.status(404).json({
      Message: `No application '${
        request.params.applicationName
      }' found in cluster '${request.params.clusterName}'.`
    });
  } catch (err) {
    log.error(
      `Error while reading deployments for '${request.params.clusterName}'`,
      err
    );
    response.status(503).json({
      Message: `Unexpected error when trying to read deployment data for '${
        request.params.applicationName
      }' in cluster '${request.params.clusterName}'.`
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
  log.debug(
    `Getting latest deployments for cluster '${request.params.clusterName}'.`
  );

  try {
    log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
    log.debug(
      `Searching for applications in cluster '${request.params.clusterName}'.`
    );

    /*let deployments = yield Deployments.find()
      .where("cluster.cluster_name")
      .equals(request.params.clusterName)
      .sort({
        created: -1
      })
      .distinct('application_name')
      .limit(150);*/
    
    let deployments = yield Deployments.aggregate([
      { $match:  {"cluster.cluster_name": request.params.clusterName} },
      { $sort:   {"created": -1} },
      { $group:  {
                  _id:              "$application_name",
                  created:          {$first: "$created"},
                  service_file_md5: {$first: "$service_file_md5"},
                  cluster:          {$first: "$cluster"},
                  services:         {$first: "$services"}
                }
      },
      { $limit:  150 }
    ]);

    let result = [];
    deployments.forEach(deployment => {
      log.info(`Deployment: '${deployment}'`);
      if (!containsApplication(result, deployment)) {
        const application = toApplication(deployment);
        if (application) {
          result.push(application);
        }
      }
    });

    if (result.length > 0) {
      log.info(`Found ${result.length} deployments for '${request.params.clusterName}'`);
      response.json(result);
    } else {
      log.info(`Found no deployments for '${request.params.clusterName}'`);
      response.status(404).json({
        Message: `No deployed applications found in cluster '${
          request.params.clusterName
        }'.`
      });
    }
  } catch (err) {
    log.error(
      `Error while reading deployments for '${request.params.clusterName}'`,
      err
    );
    response.status(503).json({
      Message: `Unexpected error when trying to read deployment data for cluster '${
        request.params.clusterName
      }'.`
    });
  }
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

  // Set application
  application.applicationName = deployment.application_name;

  application.created = deployment.created;
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
      application.slackChannels = label.value;
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

  return application;
}