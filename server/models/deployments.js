'use strict'

const mongoose = require('mongoose')
const config = require('../configuration').server

const schema = mongoose.Schema({
    "applicationName": String,
    "cluster": String,
    "version": String,
    "imageName": String,
    "applicationPath": String,
    "created": Number,
    "monitorUrl": String,
    "monitorPattern": String,
    "importance": String,
    "publicNameSwedish": String,
    "publicNameEnglish": String,
    "descriptionSwedish": String,
    "descriptionEnglish": String,
    "team": String,
    "applicationUrl": String,
    "friendlyName": String,
    "publicUserDocumentationUrl": String,
    "applicationPath": String,
    "type": String
  }

)

const Deployments = mongoose.model(config.collection, schema)

module.exports = {
  Deployments: Deployments,
  schema: schema
}