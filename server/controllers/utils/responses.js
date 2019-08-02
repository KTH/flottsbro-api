"use strict";

const log = require("kth-node-log");

function toMessage(message) {
  return {
    Message: message
  };
}

function okMessage(response, message) {
  log.debug(application);
  ok(toMessage(message));
}
function ok(response, application) {
  log.debug(application);
  response.status(200).json(application);
}

function notFound(response, message) {
  log.debug(message);
  response.status(404).json(toMessage(message));
}

function error(response, message) {
  log.error(message);
  response.status(503).json(toMessage(message));
}

module.exports = {
  ok: ok,
  okMessage: okMessage,
  notFound: notFound,
  error: error
};
