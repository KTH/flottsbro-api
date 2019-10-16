"use strict";

const slack = require("../../utils/slack.js");
const deploymentUtil = require("./deploymentUtils.js");
const log = require("kth-node-log");

function sendToDeploymentSlackChannel(deployment) {
  if (deploymentUtil.isProduction(deployment.cluster)) {
    log.info(
      `Slack for all deployments in  (if configured) - ${deployment.applicationName}.`
    );

    let message = `Importance: :importance-${deployment.importance}: ${deployment.importance} *#${deployment.team}'s* service *${deployment.friendlyName}* is updated in production.`;

    if (deployment.applicationUrl != null && deployment.applicationUrl != "") {
      message = `${message} - ${deployment.applicationUrl}`;
    }

    slack.sendMessage(message);
  }
}

module.exports = {
  sendToDeploymentSlackChannel: sendToDeploymentSlackChannel
};
