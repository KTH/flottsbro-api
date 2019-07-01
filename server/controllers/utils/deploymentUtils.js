"use strict";

const log = require("kth-node-log");

/**
 * Clean up a deployment json and validate that mandatory fields have the correct values.
 * @param {*} deployment
 */
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

function findFirstMatch(deployments, searchPath) {
  log.info("In find");
  deployments.forEach(deployment => {
    if (deployment.applicationPath && deployment.applicationPath != "/") {
      if (searchPath.startsWith(deployment.applicationPath)) {
        log.info(
          `'${searchPath}' starts with '${
            deployment.applicationPath
          }', used by '${deployment.applicationName}'.`
        );
        return deployment;
      }
    }
  });
}

/**
 * If the attribute cluster (deployment.cluster) is of
 * any value considered to be production, true is returned.
 * @param {*} cluster
 */
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
  } else if (cluster == "management") {
    return true;
  }

  return false;
}

module.exports = {
  isProduction: isProduction,
  cleanDeployment: cleanDeployment,
  findFirstMatch: findFirstMatch
};
