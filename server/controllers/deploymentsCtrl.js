"use strict";

const deploys = require("../models/deployments.js");
const co = require("co");
const slackUtils = require("./utils/slackUtils.js");
const deploymentUtils = require("./utils/deploymentUtils.js");
const responses = require("./utils/responses.js");

module.exports = {
  addLatestForApplicationName: co.wrap(addLatestForApplicationName),
  getLatestForApplicationName: co.wrap(getLatestForApplicationName),
  deleteApplicationName: co.wrap(deleteApplicationName),
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
  const requestStarted = Date.now();

  let searchPath = decodeURIComponent(request.params.path);
  let clusterName = request.params.clusterName;

  let applications = yield deploys.getLatestByCluster(
    clusterName,
    getType(clusterName)
  );
  let application = deploymentUtils.findFirstMatch(applications, searchPath);

  if (application) {
    responses.ok(response, application);
  } else {
    responses.notFound(
      response,
      `No deployed applications found in cluster '${clusterName}' starting with path '${searchPath}'.`
    );
  }
}

function getType(clusterName) {
  if (deploymentUtils.isProduction(clusterName)) {
    return deploys.types.PRODUCTION;
  }
  return deploys.types.PRODUCTION;
}

/**
 * Gets the latest deployments as an array for a specified cluster name.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestByClusterName(request, response, next) {
  let clusterName = request.params.clusterName;

  let applications = [];

  applications = yield deploys.getLatestByCluster(
    clusterName,
    getType(clusterName)
  );

  if (applications == undefined) {
    responses.error(
      response,
      `Unexpected error when trying to read deployment data for cluster '${request.params.clusterName}'.`
    );
    return;
  }

  responses.ok(response, addCalculatedProperties(applications));
}

function addCalculatedProperties(applications) {
  return applications.map(addSwaggerLink);
}

function addSwaggerLink(application) {
  if (isSwaggerLink(application.publicUserDocumentationUrl)) {
    application.publicApiDocumentationUrl =
      application.publicUserDocumentationUrl;
  }

  return application;
}

function isSwaggerLink(publicUserDocumentationUrl) {
  if (publicUserDocumentationUrl == null) {
    return false;
  }

  if (publicUserDocumentationUrl.includes("swagger")) {
    return true;
  }
  return false;
}

/**
 * Add a json payload to storage according to https://gita.sys.kth.se/Infosys/furano/blob/master/schemas/dizin/deployment.json
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* addLatestForApplicationName(request, response, next) {
  let clusterName = request.params.clusterName;
  let payload = JSON.parse(JSON.stringify(request.body));

  if (payload.cluster != clusterName) {
    responses.error(
      response,
      `The json payload says deployment was done in '${payload.cluster}' but the uri says '/v1/latest/${clusterName}'.`
    );
    return;
  }

  let application = yield deploys.add(payload);

  if (application == undefined) {
    responses.error(
      response,
      `Faild to store application '${payload.applicationName}'`
    );
    return;
  }

  slackUtils.sendToDeploymentSlackChannel(application);

  responses.ok(response, application);
}

function* deleteApplicationName(request, response, next) {
  let clusterName = request.params.clusterName;
  let applicationName = request.params.applicationName;

  let done = yield deploys.deleteApplication(clusterName, applicationName);

  if (done) {
    responses.ok(response, `${applicationName} removed from ${clusterName}.`);
  } else {
    responses.ok(
      response,
      `Found no match for '${applicationName}' in '${clusterName}' to remove.`
    );
  }
}

/**
 * Gets the latest deployment for an application in a specified cluster
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplicationName(request, response, next) {
  let clusterName = request.params.clusterName;
  let applicationName = request.params.applicationName;

  // Ugly way to import systems from file. Call this enpoint to load file and store it.
  if (process.env.IMPORT_FROM_FILE) {
    const fileImport = require("../../data/fileImport.js").importCsv(
      "manual.csv"
    );
  }

  let application = yield deploys.getApplication(
    clusterName,
    applicationName,
    getType(clusterName)
  );

  if (application == null) {
    responses.notFound(
      response,
      `No application '${applicationName}' found in cluster '${clusterName}'.`
    );
    return;
  }

  if (application == undefined) {
    responses.error(
      response,
      `Unexpected error when trying to read deployment data for cluster '${clusterName}' and application '${applicationName}'.`
    );
    return;
  }

  responses.ok(response, application);
}

/**
 * Gets the latest deployment for an application where the monitor url is monitorUrl.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* getLatestForApplicationByMonitorUrl(request, response, next) {
  let clusterName = request.params.clusterName;
  let monitorUrl = request.params.monitorUrl;

  let application = yield deploys.getApplicationByMonitorUrl(
    clusterName,
    monitorUrl,
    getType(clusterName)
  );

  if (application == null) {
    responses.notFound(
      response,
      `No application matched '${monitorUrl}' in '${clusterName}'.`
    );
    return;
  }

  if (application == undefined) {
    responses.error(
      response,
      `Unexpected error when trying to read deployment data for cluster '${clusterName}' and application '${monitorUrl}'.`
    );
    return;
  }

  responses.ok(response, application);
}
