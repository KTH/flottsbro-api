'use strict'

const mongoose = require('mongoose')

const schema = mongoose.Schema({
  'created': Number,
  'service_file_md5': String,
  'application_name': String,
  'cluster': {
    'environment': [{
        'value': String,
        'key': String
      },
      {
        'value': String,
        'key': String
      },
      {
        'value': String,
        'key': String
      },
      {
        'value': String,
        'key': String
      },
      {
        'value': String,
        'key': String
      },
      {
        'value': String,
        'key': String
      },
      {
        'value': String,
        'key': String
      }
    ],
    'cluster_name': String
  },
  'services': [{
    'environment': [{
      'value': String,
      'key': String
    }],
    'service_name': String,
    'labels': [],
    'deploy_labels': [{
        'label': String,
        'value': String
      },
      {
        'label': String,
        'value': String
      },
      {
        'label': String,
        'value': String
      },
      {
        'label': String,
        'value': String
      },
      {
        'label': String,
        'value': String
      },
      {
        'label': String,
        'value': String
      }
    ],
    'image': {
      'static_version': String,
      'image_name': String,
      'semver_version': String
    }
  }]
})

const Deployments = mongoose.model('deployment', schema)



/**
 * Gets the latest deployments as an array for a specified cluster name.
 * @param {*} clusterName
 * @param {*} response
 * @param {*} next
 */
function* getLatestByClusterNameFromDatabase(clusterName) {

  let result = undefined;

  try {
    let deployments = yield Deployments.aggregate([{
        $match: {
          "cluster.cluster_name": clusterName
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      {
        $group: {
          _id: "$application_name",
          created: {
            $first: "$created"
          },
          application_name: {
            $first: "$application_name"
          },
          service_file_md5: {
            $first: "$service_file_md5"
          },
          cluster: {
            $first: "$cluster"
          },
          services: {
            $first: "$services"
          }
        }
      },
      {
        $limit: 50
      }
    ]);

    result = [];

    deployments.forEach(deployment => {
      log.debug(`Deployment: '${JSON.stringify(deployment)}'`);
      if (!containsApplication(result, deployment)) {
        const application = toApplication(deployment);
        if (application) {
          result.push(application);
        }
      }
    });

  } catch (err) {
    log.error(`Error while reading deployments for '${clusterName}'`, err);
  }

  return result;

}


module.exports = {
  Deployments: Deployments,
  schema: schema
}