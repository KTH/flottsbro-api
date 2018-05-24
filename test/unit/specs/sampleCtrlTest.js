/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
"use strict";
const proxyquire = require("proxyquire");
const expect = require("chai").expect;

function MockSample(doc) {
  this._id = doc._id;
  this.name = doc.name;
}

MockSample.findById = function (id) {};