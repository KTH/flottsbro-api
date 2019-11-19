"use strict";

const mongoose = require("mongoose");
const config = require("../configuration").server;
const log = require("kth-node-log");
const deploymentUtils = require("../controllers/utils/deploymentUtils.js");

const types = { PRODUCTION: "production", REFERENS: "reference" };
const limits = { NO_LIMIT: 1000, ONLY_ONE: 1 };

const schema = mongoose.Schema({
  applicationName: String,
  cluster: String,
  type: String,
  version: String,
  imageName: String,
  applicationPath: String,
  created: Number,
  monitorUrl: String,
  monitorPattern: String,
  importance: String,
  publicNameSwedish: String,
  publicNameEnglish: String,
  descriptionSwedish: String,
  descriptionEnglish: String,
  team: String,
  applicationUrl: String,
  friendlyName: String,
  publicUserDocumentationUrl: String,
  applicationPath: String
});

const Deployments = mongoose.model(config.collection, schema);

/**
 * Add a deployemnt to database.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function* add(deployment) {
  let result;
  const requestStarted = Date.now();

  try {
    let deploy = deploymentUtils.cleanDeployment(deployment);
    let document = new Deployments(deploy);
    result = yield document.save();
    log.info(
      `Added '${result.applicationName}' to database with _id '${
        result._id
      }'. Took ${Date.now() - requestStarted}ms.`
    );
  } catch (err) {
    log.error(`Error when writing deployment to db. ${deploy} `, err);
  }

  return result;
}

/**
 * Gets the latest deployments as an array for a specified cluster name.
 *
 * @param {*} clusterName
 * @param {*} response
 * @param {*} next
 */
function* getLatestByCluster(clusterName, type = types.PRODUCTION) {
  let result = [];
  const requestStarted = Date.now();

  let select = {
    cluster: clusterName,
    type: type
  };

  if (clusterName === types.PRODUCTION || clusterName === types.REFERENS) {
    select = {
      type: type
    };
  }

  try {
    result = yield Deployments.aggregate(getQuery(select, limits.NO_LIMIT));

    log.info(
      `Found ${
        result.length
      } applications deployed in '${clusterName}'. Took ${Date.now() -
        requestStarted}ms.`
    );
  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'.`, err);
  }

  return result;
}

/**
 * Gets the latest deployment for an application in a specified cluster
 *
 * @param {*} clusterName
 * @param {*} applicationName
 */
function* getApplication(clusterName, applicationName) {
  let result = undefined;
  const requestStarted = Date.now();

  try {
    const results = yield Deployments.aggregate(
      getQuery(
        {
          applicationName: applicationName,
          cluster: clusterName
        },
        limits.ONLY_ONE
      )
    );
    result = results[0];
    log.info(
      `Found ${
        results.length
      } application(s) deployed matching '${clusterName}'/'${applicationName}'. Took ${Date.now() -
        requestStarted}ms.`
    );
  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'`, err);
  }

  return result;
}

/**
 * Gets the latest deployment for an application in a specified cluster
 *
 * @param {*} clusterName
 * @param {*} applicationName
 */
function* deleteApplication(clusterName, applicationName) {
  let result = false;
  const requestStarted = Date.now();

  try {
    const results = yield Deployments.deleteMany(
      {
        applicationName: applicationName,
        cluster: clusterName
      },
      function(deleteError, documents) {
        if (deleteError) {
          console.log(deleteError);
        } else {
          result = true;
        }
      }
    );
    log.debug(`Deleted. Took ${Date.now() - requestStarted}ms.`);
  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'`, err);
  }

  return result;
}

/**
 * Gets the latest deployment for an application where the monitor url is monitorUrl.
 *
 * @param {*} clusterName
 * @param {*} monitorUrl
 */
function* getApplicationByMonitorUrl(clusterName, monitorUrl) {
  let result;
  const requestStarted = Date.now();

  try {
    let applications = yield Deployments.aggregate(
      getQuery(
        {
          monitorUrl: monitorUrl,
          cluster: clusterName
        },
        limits.ONLY_ONE
      )
    );

    result = "";

    if (applications.length > 0) {
      log.info(
        `Found application for '${monitorUrl} in '${clusterName}'. Took ${Date.now() -
          requestStarted}ms.`
      );
      result = applications[0];
    } else {
      result = null;
    }
  } catch (err) {
    log.error(`Error while reading applications for '${clusterName}'`, err);
  }

  return result;
}

/**
 * Gets a mongo query.
 *
 * @param {*} match $match attributes
 * @param {*} limit limit the results
 */
function getQuery(match, limit) {
  return [
    {
      $match: match
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
      $limit: limit
    }
  ];
}

/**
 * Result attributes.
 */
function getGroup() {
  return {
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
    type: {
      $first: "$type"
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
    friendlyName: {
      $first: "$friendlyName"
    },
    publicUserDocumentationUrl: {
      $first: "$publicUserDocumentationUrl"
    }
  };
}

module.exports = {
  Deployments: Deployments,
  schema: schema,
  add: add,
  getApplication: getApplication,
  deleteApplication: deleteApplication,
  getApplicationByMonitorUrl: getApplicationByMonitorUrl,
  getLatestByCluster: getLatestByCluster,
  types: types
};
