const IncomingWebhook = require("@slack/webhook").IncomingWebhook;
const log = require("kth-node-log");

let webhook = null;

/**
 * Reuse the existing webhook client or create a new (Singleton pattern).
 */
function getWebhook() {
  if (webhook != null) {
    return webhook;
  }
  return initWebhook();
}

/**
 * Setup the webbook for future usage.
 */
function initWebhook() {
  if (getWebhookUrl() != null) {
    webhook = new IncomingWebhook(getWebhookUrl());
    return webhook;
  }
}

/**
 * Get the webhook url defined in env SLACK_WEBHOOK_DEPLOYMENTS
 */
function getWebhookUrl() {
  return process.env.SLACK_WEBHOOK_DEPLOYMENTS
    ? process.env.SLACK_WEBHOOK_DEPLOYMENTS
    : null;
}
/**
 * Send a message to the channel defined in env SLACK_WEBHOOK_DEPLOYMENTS.
 * @param {*} message
 */
async function sendMessage(message) {
  log.debug(`Is Slack disabled: ${disabled()}`);
  if (disabled()) {
    return;
  }

  log.debug(`Sending '${message}' to Slack.`);
  await getWebhook().send({
    text: message
  });
}

/**
 * Should post to Slack or not?
 */
function disabled() {
  return webhook ? false : true;
}

/**
 * Init the webhook.
 */
initWebhook();

module.exports = {
  sendMessage: sendMessage
};
