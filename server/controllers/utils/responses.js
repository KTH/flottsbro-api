"use strict";

const log = require("kth-node-log");

function toMessage(message) {
  return {
    Message: message
  };
}

function okMessage(response, message) {
  ok(toMessage(message));
}
function ok(response, application) {
  response.status(200).json(application);
}

function notFound(response, message) {
  response.status(404).json(toMessage(message));
}

function error(response, message) {
  response.status(503).json(toMessage(message));
}

module.exports = {
  ok: ok,
  okMessage: okMessage,
  notFound: notFound,
  error: error
};
