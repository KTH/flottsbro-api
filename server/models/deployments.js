'use strict'

const mongoose = require('mongoose')

const schema = mongoose.Schema({
  _id: {
    type: String
  },
  services: {
    type: String,
    trim: true,
    default: ''
  }
})

const Deployments  = mongoose.model('Deployments', schema)

module.exports = {
  Deployments: Deployments,
  schema: schema
}
