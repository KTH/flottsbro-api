"use strict";

const packageFile = require("../../package.json");
var version = require("../../config/version");
const getPaths = require("kth-node-express-routing").getPaths;
const db = require("kth-node-mongo");
const os = require("os");

const Promise = require("bluebird");
const registry = require("component-registry").globalRegistry;
const monitor = require("kth-node-monitor");
const started = new Date();

/**
 * System controller for functions such as about and monitor.
 * Avoid making changes here in sub-projects.
 */
module.exports = {
  monitor: getMonitor,
  about: getAbout,
  robotsTxt: getRobotsTxt,
  paths: getPathsHandler,
  checkAPIKey: checkAPIKey,
  swagger: getSwagger
};

/**
 * GET /swagger.json
 * Swagger config
 */
function getSwagger(req, res) {
  res.json(require("../../swagger.json"));
}

/**
 * GET /_about
 * About page
 */
function getAbout(req, res) {
  const paths = getPaths();
  res.render("system/about", {
    dockerVersion: version.dockerVersion,
    hostname: os.hostname(),
    appName: packageFile.name,
    appDescription: packageFile.description,
    monitorUri: paths.system.monitor.uri,
    robotsUri: paths.system.robots.uri,
    started: started
  });
}

/**
 * GET /_monitor
 * Monitor page
 */
function getMonitor(req, res) {
  // Check MongoDB
  const mongodbHealthUtil = registry.getUtility(
    monitor.interfaces.IHealthCheck,
    monitor.interfaces.names.KTH_NODE_MONGODB
  );
  const subSystems = [mongodbHealthUtil.status(db, { required: true })];
  /* -- You will normally not change anything below this line -- */

  // Determine system health based on the results of the checks above. Expects
  // arrays of promises as input. This returns a promise
  const systemHealthUtil = registry.getUtility(
    monitor.interfaces.IHealthCheck,
    monitor.interfaces.names.KTH_NODE_SYSTEM_CHECK
  );
  const systemStatus = systemHealthUtil.status(null, subSystems);

  systemStatus
    .then(status => {
      // Return the result either as JSON or text
      if (req.headers["accept"] === "application/json") {
        let outp = systemHealthUtil.renderJSON(status);
        res.status(status.statusCode).json(outp);
      } else {
        let outp = systemHealthUtil.renderText(status);
        res
          .type("text")
          .status(status.statusCode)
          .send(outp);
      }
    })
    .catch(err => {
      res
        .type("text")
        .status(500)
        .send(err);
    });
}

/**
 * GET /robots.txt
 * Robots.txt page
 */
function getRobotsTxt(req, res) {
  res.type("text").render("system/robots");
}

/**
 * GET /_paths
 * Return all paths for the system
 */
function getPathsHandler(req, res) {
  res.json(getPaths());
}

function checkAPIKey(req, res) {
  res.end();
}
