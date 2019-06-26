"use strict";

const Deployments = require("../models").deployments.Deployments;
const co = require("co");
const log = require("kth-node-log");
const slack = require("../utils/slack.js");

module.exports = {
  addLatestForApplicationName: co.wrap(addLatestForApplicationName),
  addLatestForApplicationNameToDatabase: co.wrap(
    _addLatestForApplicationNameToDatabase
  ),
  getLatestForApplicationName: co.wrap(getLatestForApplicationName),
  getLatestForApplicationByMonitorUrl: co.wrap(
    getLatestForApplicationByMonitorUrl
  ),
  getLatestByClusterName: co.wrap(getLatestByClusterName),
  getLatestBySearch: co.wrap(getLatestBySearch)
};

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestBySearch(request, response, next) {
  let result = undefined;
  let searchPath = decodeURIComponent(request.params.path);

  log.debug(
    `Getting application in '${request.params.clusterName}' matching path '${
      request.params.path
    }'.`
  );

  let deployments = yield getLatestByClusterNameFromDatabase(
    request.params.clusterName
  );

  deployments.forEach(deployment => {
    if (deployment.applicationPath && deployment.applicationPath != "/") {
      if (searchPath.startsWith(deployment.applicationPath)) {
        log.info(
          `'${searchPath}' starts with '${
            deployment.applicationPath
          }', used by '${deployment.applicationName}'.`
        );
        result = deployment;
        return;
      }
    }
  });
  if (result) {
    response.json(result);
  } else {
    response.status(404).json({
      Message: `No deployed applications found in cluster '${
        request.params.clusterName
      }' starting with path '${searchPath}'.`
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
  log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
  log.debug(
    `Searching for applications in cluster '${request.params.clusterName}'.`
  );

  let deployments;
  if (request.params.clusterName == "production") {
    deployments = yield getLatestByTypeFromDatabase(request.params.clusterName);
  } else {
    deployments = yield getLatestByClusterNameFromDatabase(
      request.params.clusterName
    );
  }

  if (deployments == undefined) {
    response.status(503).json({
      Message: `503 - Unexpected error when trying to read deployment data for cluster '${
        request.params.clusterName
      }'.`
    });
    return;
  }

  if (deployments.length > 0) {
    response.json(deployments);
    return;
  }

  response.status(404).json({
    Message: `No deployed applications found in cluster '${
      request.params.clusterName
    }'.`
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
    let deployments = yield Deployments.aggregate([
      {
        $match: {
          cluster: clusterName
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      getGroup(),
      {
        $limit: 100
      }
    ]);

    result = [];

    deployments.forEach(deployment => {
      result.push(deployment);
    });

    log.info(
      `Found ${result.length} applications deployed in '${clusterName}'.`
    );
  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'.`, err);
  }

  return result;
}

/**
 * Gets the latest deployments as an array for a specified by type (production/reference).
 * @param {*} type
 * @param {*} response
 * @param {*} next
 */
function* getLatestByTypeFromDatabase(type) {
  let result = undefined;

  try {
    let deployments = yield Deployments.aggregate([
      {
        $match: {
          type: type
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      getGroup(),
      {
        $limit: 100
      }
    ]);

    result = [];

    deployments.forEach(deployment => {
      result.push(deployment);
    });

    log.info(`Found ${result.length} applications deployed in '${type}'.`);
  } catch (err) {
    log.error(`Error while reading deployments for '${type}'.`, err);
  }

  return result;
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
    let deployments = yield Deployments.aggregate([
      {
        $match: {
          cluster: clusterName
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      getGroup(),
      {
        $limit: 100
      }
    ]);

    result = [];

    deployments.forEach(deployment => {
      result.push(deployment);
    });

    log.info(
      `Found ${result.length} applications deployed in '${clusterName}'.`
    );
  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'.`, err);
  }

  return result;
}

function cleanDeployment(deployment) {
  if (deployment.created == null) {
    let timestamp = Math.round(new Date().getTime() / 1000);
    deployment.created = timestamp;
  }
  if (deployment.importance == null) {
    deployment.importance = "medium";
  }
  deployment.importance = deployment.importance.toLowerCase();
  if (deployment.team == null) {
    deployment.team = "ita-ops";
  }
  deployment.team = deployment.team.toLowerCase();
  if (deployment.cluster == null) {
    deployment.cluster = "on-prem";
  }
  deployment.cluster = deployment.cluster.toLowerCase();
  if (deployment.version == null) {
    deployment.version = "unknown";
  }
  if (deployment.monitorPattern == null) {
    deployment.monitorPattern = "APPLICATION_STATUS: OK";
  }
  if (deployment.friendlyName == null) {
    deployment.friendlyName = deployment.publicNameEnglish;
  }
  if (deployment.type == null) {
    if (isProduction(deployment.cluster)) {
      deployment.type = "production";
    } else {
      deployment.type = "reference";
    }
  }
  deployment.type = deployment.type.toLowerCase();

  return deployment;
}

function isProduction(cluster) {
  if (cluster == null) {
    return false;
  } else if (cluster == "on-prem") {
    return true;
  } else if (cluster == "active") {
    return true;
  } else if (cluster == "integral") {
    return true;
  } else if (cluster == "saas") {
    return true;
  }
  return false;
}
/**
 * Add.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* addLatestForApplicationName(request, response, next) {
  log.info(
    `Adding latest deployments for cluster '${request.params.clusterName}'.`
  );

  try {
    let deployment = JSON.parse(JSON.stringify(request.body));

    if (deployment.cluster != request.params.clusterName) {
      response.status(503).json({
        Message: `Wrong URI for adding deployment. The deployment json says '${
          deployment.cluster
        }' but the uri states that the cluster is '${
          request.params.clusterName
        }'.`
      });
    }

    deployment = yield _addLatestForApplicationNameToDatabase(deployment);

    if (deployment != null) {
      if (isProduction(deployment.cluster)) {
        log.info(
          `Slack for all deployments in  (if configured) - ${
            deployment.applicationName
          }.`
        );
        slack.sendMessage(
          `#(${deployment.team}) service *${
            deployment.friendlyName
          }* is updated in production. - ${deployment.applicationUrl}.`
        );
      } else {
        log.info(`Skip Slack.`);
      }

      response.status(200).json({
        Message: `Application '${
          deployment.applicationName
        }' stored for cluster '${deployment.cluster}'.`
      });
    } else {
      response.status(503).json({
        Message: `Faild to store application '${
          deployment.applicationName
        }' stored for cluster '${deployment.cluster}'.`
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Add.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* _addLatestForApplicationNameToDatabase(deployment) {
  try {
    deployment = cleanDeployment(deployment);

    let document = new Deployments(deployment);

    let res = document.save();

    log.info(`Added '${deployment.applicationName}' to database.`);

    log.info(deployment);
  } catch (err) {
    log.error(`Error when writing deployment to db. ${deployment}`);
    throw err;
  }

  return deployment;
}

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplicationName(request, response, next) {
  if (process.env.IMPORT_FROM_FILE) {
    const fileImport = require("../../data/fileImport.js").importCsv(
      "manual.csv"
    );
  }

  log.debug(
    `Getting latest deployments for cluster '${
      request.params.clusterName
    }' and application '${request.params.applicationName}'.`
  );
  log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
  log.debug(
    `Searching for '${request.params.applicationName}' in cluster '${
      request.params.clusterName
    }'.`
  );

  let deployment = yield getLatestForApplicationFromDatabase(
    request.params.clusterName,
    request.params.applicationName
  );

  if (deployment == "") {
    response.status(404).json({
      Message: `No application '${
        request.params.applicationName
      }' found in cluster '${request.params.clusterName}'.`
    });
    return;
  }

  if (deployment == undefined) {
    response.status(404).json({
      Message: `503 - Unexpected error when trying to read deployment data for cluster '${
        request.params.clusterName
      }' and application '${request.params.applicationName}'.`
    });
    return;
  }

  response.json(deployment);
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
    let deployment = yield Deployments.aggregate([
      {
        $match: {
          applicationName: applicationName,
          cluster: clusterName
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      getGroup(),
      {
        $limit: 1
      }
    ]);

    result = "";

    if (deployment.length > 0) {
      log.info(
        `Found deployment for '${applicationName}:${
          deployment.version
        }' in '${clusterName}'`
      );

      result = deployment[0];
    }
  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'`, err);
  }

  return result;
}

/**
 * Gets the latest deployment for an application where the monitor url is monitorUrl.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplicationByMonitorUrl(request, response, next) {
  log.info(
    `Getting latest deployments for cluster '${
      request.params.clusterName
    }' and monitorUrl '${request.params.monitorUrl}'.`
  );
  log.debug(`Collection name: '${Deployments.collection.collectionName}'`);
  log.debug(
    `Searching for '${request.params.monitorUrl}' in cluster '${
      request.params.clusterName
    }'.`
  );

  let deployment = yield getLatestForApplicationByMonitorUrlFromDatabase(
    request.params.clusterName,
    request.params.monitorUrl
  );

  if (deployment == undefined) {
    response.status(503).json({
      Message: `503 - Unexpected error when trying to read deployment data for cluster '${
        request.params.clusterName
      }' and application '${request.params.monitorUrl}'.`
    });
    return;
  }

  if (deployment == "") {
    response.status(404).json({
      Message: `No application found fro '${
        request.params.monitorUrl
      }' cluster '${request.params.clusterName}'.`
    });
    return;
  }

  response.json(deployment);
}

/**
 * Gets the latest deployment for an application where the monitor url is monitorUrl.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplicationByMonitorUrlFromDatabase(
  clusterName,
  monitorUrl
) {
  let result = "";

  try {
    let deployment = yield Deployments.aggregate([
      {
        $match: {
          monitorUrl: monitorUrl,
          cluster: clusterName
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      {
        $group: getGroup()
      },
      {
        $limit: 1
      }
    ]);

    log.info(`Found deployment for '${monitorUrl} in '${clusterName}'`);
    result = "";

    if (deployment) {
      result = deployment[0];
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

function getGroup() {
  return {
    $group: {
      _id: "$applicationName",
      created: {
        $first: "$created"
      },
      applicationName: {
        $first: "$applicationName"
      },
      cluster: {
        $first: "$cluster"
      },
      version: {
        $first: "$version"
      },
      imageName: {
        $first: "$imageName"
      },
      applicationUrl: {
        $first: "$applicationUrl"
      },
      applicationPath: {
        $first: "$applicationPath"
      },
      aboutUrl: {
        $first: "$aboutUrl"
      },
      monitorUrl: {
        $first: "$monitorUrl"
      },
      monitorPattern: {
        $first: "$monitorPattern"
      },
      importance: {
        $first: "$importance"
      },
      monitorPattern: {
        $first: "$monitorPattern"
      },
      publicNameSwedish: {
        $first: "$publicNameSwedish"
      },
      publicNameEnglish: {
        $first: "$publicNameEnglish"
      },
      descriptionSwedish: {
        $first: "$descriptionSwedish"
      },
      descriptionEnglish: {
        $first: "$descriptionEnglish"
      },
      team: {
        $first: "$team"
      },
      applicationUrl: {
        $first: "$applicationUrl"
      },
      friendlyName: {
        $first: "$friendlyName"
      },
      publicUserDocumentationUrl: {
        $first: "$publicUserDocumentationUrl"
      }
    }
  };
}
