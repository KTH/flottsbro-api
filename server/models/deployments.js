'use strict'

const mongoose = require('mongoose')

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
    "applicationPath": String
  }

)

const Deployments = mongoose.model('deploymentv2', schema)

module.exports = {
  Deployments: Deployments,
  schema: schema
}