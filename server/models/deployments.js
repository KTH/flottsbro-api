'use strict'
const mongoose = require('mongoose')

const schema = mongoose.Schema(
  {
    "created": Number,
    "service_file_md5": String,
    "application_name": String,
    "cluster": {
      "environment": [
        {
          "value": String,
          "key": String
        },
        {
          "value": String,
          "key": String
        },
        {
          "value": String,
          "key": String
        },
        {
          "value": String,
          "key": String
        },
        {
          "value": String,
          "key": String
        },
        {
          "value": String,
          "key": String
        },
        {
          "value": String,
          "key": String
        },
      ],
      "cluster_name": String
    },
    "services": [
      {
        "environment": [
          {
            "value": String,
            "key": String
          }
        ],
        "service_name": String,
        "labels": [],
        "deploy_labels": [
          {
            "label": String,
            "value": String
          },
          {
            "label": String,
            "value": String
          },
          {
            "label": String,
            "value": String
          },
          {
            "label": String,
            "value": String
          },
          {
            "label": String,
            "value": String
          },
          {
            "label": String,
            "value": String
          }
        ],
        "image": {
          "static_version": String,
          "image_name": String,
          "semver_version": String
        }
      }
    ]
  }
)

const Deployments = mongoose.model('deployment', schema)

module.exports = {
  Deployments: Deployments,
  schema: schema
}
