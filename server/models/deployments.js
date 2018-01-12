'use strict'
const mongoose = require('mongoose')

const schema = mongoose.Schema(
  {
    _id: Number
  }
)

const Deployments  = mongoose.model('deployment', schema)

module.exports = {
  Deployments: Deployments,
  schema: schema
}
