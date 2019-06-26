const IncomingWebhook = require("@slack/webhook").IncomingWebhook;
const log = require("kth-node-log");

let webhook = null;

function disabled() {
  return webhook ? false : true;
}

function getWebhook() {
  if (webhook != null) {
    return webhook;
  }
  return initWebhook();
}

function initWebhook() {
  if (getWebhookUrl() != null) {
    webhook = new IncomingWebhook(getWebhookUrl());
    return webhook;
  }
}

function getWebhookUrl() {
  return process.env.SLACK_WEBHOOK_DEPLOYMENTS
    ? process.env.SLACK_WEBHOOK_DEPLOYMENTS
    : null;
}

async function sendMessage(message) {
  log.debug(`Is Slack disabled: ${disabled()}`);
  if (disabled()) {
    return;
  }

  log.info(`Sending '${message}' to Slack.`);
  await getWebhook().send({
    text: message
  });
}

initWebhook();

module.exports = {
  sendMessage: sendMessage
};
