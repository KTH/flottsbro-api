const IncomingWebhook = require("@slack/webhook").IncomingWebhook;

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
  if (disabled()) {
    return;
  }

  await getWebhook().send({
    text: message
  });
}

initWebhook();

module.exports = {
  sendMessage: sendMessage
};
