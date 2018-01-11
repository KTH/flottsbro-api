# kth-node-configuration
[![Build Status](https://travis-ci.org/KTH/kth-node-configuration.svg?branch=master)](https://travis-ci.org/KTH/kth-node-configuration)

Configuration module for Node.js projects.

## Usage

### node-api projects
In node-api projects you only have a single settings file called serverSettings.js. Create your configuration by adding the following code:

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([
  require('../../../config/serverSettings')
])

module.exports.server = serverConfig
```

All options are available in this object.

### node-web projects

In node-web projects your settings are split in three files:

- commonSettings.js -- settings shared by browser and server (i.e. don't store any secrets here)
- browserSettings.js -- settings passed to the browser (i.e. don't store any secrets here either)
- serverSettings.js -- settings that are specific to the server

If you use LDAP you will also want to add default LDAP settings to your server config.

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')
// The ldapDefaultSettings contains ldapClient defaults object
const ldapDefaultSettings = require('kth-node-configuration').unpackLDAPConfig.defaultSettings

// These settings are used by the server
const serverConfig = generateConfig([
  ldapDefaultSettings,
  require('../../../config/commonSettings'),
  require('../../../config/serverSettings')
])

module.exports.server = serverConfig

// These settings are passed to the browser
const browserConfig = generateConfig([
  require('../../../config/commonSettings'),
  require('../../../config/browserSettings')
])

module.exports.browser = browserConfig
```

### Helper methods

There are a couple of helper methods available to allow your settings files to be a bit more concise.

The env-vars should be on the same form as the default URI.

Options override any settings you pass through env-vars or defaults.

NOTE: the helper methods obey standard URI syntax. Any get params you add will be set as properties
on the config object.

#### Escaping
Don't forget to escape special characters such as:

- '&' in keys to '%26'
- '/' in usernames or passwords to '%2F'

#### unpackApiKeysConfig(ENV_VAR_NAME_URI, defaultURI)

This call returns an array of api access key objects.

```javascript
const defaultUri = '?name=devClient&apiKey=1234&scope=write&scope=read'
unpackApiKeysConfig('API_KEYS', defaultUri)
```

To define multiple API_KEYS you name each key as if it was a reference to an array. The unpacker will iterate from 0 and
add each item until it comes across a value that is undefined:
```
API_KEYS_0 = '?name=devClient&apiKey=1234&scope=write&scope=read'
API_KEYS_1 = '?name=devClient&apiKey=1234&scope=write&scope=read'
API_KEYS_2 = '?name=devClient&apiKey=1234&scope=write&scope=read'
```

#### unpackKOPPSConfig(ENV_VAR_NAME_URI, defaultURI [, options])
```javascript
const defaultUri = 'http://[hostname][:port][/path]?defaultTimeout=60000'
unpackKOPPSConfig('KOPPS_URI', defaultUri)
```

#### unpackLDAPConfig(ENV_VAR_NAME_URI, ENV_VAR_NAME_PASSWORD, defaultURI [, options])
```javascript
// Never hard code defaults to LDAP in settings, always pass through env-vars
// LDAP_URI = 'ldaps://[username]@[hostname]:[port]
// LDAP_PASSWORD = 'yadayada'
unpackLDAPConfig('LDAP_URI', 'LDAP_PASSWORD')
```

NOTE 1: Some default settings are always applied and can be overridden by passing options. Check source for defaults.

NOTE 2: Having a separate config.ldap and config.ldapClient configuration is deprecated, everything should be in config.ldap.

NOTE 3: upackRedisConfig supports Azure connection string

#### unpackMongodbConfig(ENV_VAR_NAME_URI, defaultURI [, options])
```javascript
const defaultUri = 'mongodb://[hostname][:port][/path][?ssl=true]'
unpackMongodbConfig('MONGODB_URI', defaultUri)
```

#### unpackNodeApiConfig(ENV_VAR_NAME_URI, defaultURI [, options])
```javascript
const defaultUri = 'http[s]://[hostname][:port][/path][?required=true&defaultTimeout=10000]'
unpackNodeApiConfig('NODE_API_URI', defaultUri)
```

#### unpackRedisConfig(ENV_VAR_NAME_URI, defaultURI [, options])
```javascript
const defaultUri = 'redis://[hostname][:port]/'
unpackRedisConfig('REDIS_URI', defaultUri)
```

#### unpackSMTPConfig(ENV_VAR_NAME_URI, defaultURI [, options])
```javascript
// Never include username or password in default SMTP-config
const defaultUri = 'smtp://smtp.kth.se:25'
// SMTP_URI = smtp[s]://[username][:password]@[hostname]:[port]
unpackSMTPConfig('SMTP_URI', defaultUri)
```

#### unpackSequelizeConfig(ENV_VAR_NAME_URI, defaultURI [, options])
```javascript
// Never include username or password in default SMTP-config
const defaultSQLiteUri = 'sqlite://path/to/db.file'
// DB_URI = sqlite://[path/to/file]
const defaultSQLServerUri = 'mssql://username@db.test.com/InstanceName/DbName'
// DB_URI = mssql://[username][:password]@[hostname]:[port]/[DbInstance]/[DbName]
unpackSequelizeConfig('DB_URI', 'DB_PWD', defaultUri)
```

Examples of usage can be found int the node-api and node-web template projects.

## Dotenv

Use the [npm package __dotenv__][dotenv] to set environment variables during development.
Take a look at the unit tests for example usage.

[dotenv]: https://www.npmjs.com/package/dotenv

This code snippet loads env-vars with dotenv during development. In production it checks
for the availability of SERVICE_PUBLISH which is always set in a KTH Docker environment.
If it isn't found it will require localSettings.js which is the standard settings file
in the KTH Ansible environment. There you can set env-vars by `process.env.ENV_VAR = 'value'`

```javascript
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
} else if (!process.env.SERVICE_PUBLISH) {
  // This is an ANSIBLE machine which doesn't set env-vars atm
  // so read localSettings.js which we now use to fake env-vars
  // because it already exists in our Ansible setup.
  require('../config/localSettings')
}
```

## DEV NOTES ##

- vi fimpar local-/prod-/ref-/devSettings.js
  - läggs i commonSettings.js, serverSettings.js, browserSettings.js

- fimpa full, safe och secure

När vi skapar nya settings-objektet
- vi mergear commonSettings.js + serverSettings.js till servern
- vi mergear commonSettings.js + browserSettings.js till browsern
  - returneras på endpointen ./browserConfig som javascript
  TODO: - lägg till script-tag i början av all layout-filer

## Migrating from <= 1.0.1

- convert ...Settings.js files to:

  - commonSettings.js -- shared by browser and server
  - serverSettings.js -- server specific settings that should NEVER be sent to a browser
  - browserSettings.js -- browser specific settings that are passed to browser

- Search and replace:

```
  require('../**/configuration') => require('../**/configuration').server
```

  - config.full => config
  - config.safe => config
  - [xxx].secure => [xxx]
  - server.full => server

- What are these used for (kth-node-configuration)

  - module.exports.getEnv = _env
  - module.exports.getEnvString = _str
  - module.exports.getEnvBool = _bool
  - module.exports.getEnvInt = _int
  - module.exports.devDefaults = _str

- Update tests

  config.full => config

- change how we start server:

  kth-node-server@1.x:

    server.setConfig(config) => server.setConfig({ full: config })

  kth-node-server@3.x:

```javascript
server.start({
  pfx: config.ssl.pfx,
  passphrase: config.ssl.passphrase,
  key: config.ssl.key,
  ca: config.ssl.ca,
  cert: config.ssl.cert,
  port: config.port,
  logger: log // Your logging service, could be console or kth-node-log
})
```

- change in adldap.js (only if we use ldap)

  - attributes: config.ldapClient.userattrs => attributes: config.ldap.userattrs
  - config.ldapClient.filterReplaceHolder, kthid => config.ldap.filterReplaceHolder, kthid

- change configuration.js (examples for node-web and node-api apps)


*app.js*
Edit app.js to look like this:

```javascript
'use strict'

const server = require('./server/server')
require('./server/init')
```

*NODE-WEB:*

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([
  require('../../../config/commonSettings'),
  require('../../../config/serverSettings')
])

module.exports.server = serverConfig

// These settings are passed to the browser
const browserConfig = generateConfig([
  require('../../../config/commonSettings'),
  require('../../../config/browserSettings')
])

module.exports.browser = browserConfig
```

In adldap.js you need to change:

  - config.ldapClient => config.ldap

And move any config settings from ldapClient object to ldap object.

*NODE-API:*

```javascript
'use strict'
const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([
  require('../../../config/serverSettings')
])

module.exports.server = serverConfig
```

- add dependency to dotenv and have it load your .env-file on startup. server.js should start like this:

```javascript
const server = require('kth-node-server')
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}
// Now read the server config
const config = require('./init/configuration').server
```

- make sure configuration/index.js has the following export:

```javascript
module.exports = require('./configuration')
```

### The following steps only for frontend

- Add endpoint .../browserConfig to staticFiles.js (earlier name: routing.js)

```javascript
const paths = require('../routing/paths')
const browserConfig = require('../configuration').browser
const browserConfigHandler = require('kth-node-configuration').getHandler(browserConfig, paths)

...

// Expose browser configurations
server.use(config.proxyPrefixPath.uri + '/static/browserConfig', browserConfigHandler)
```

- add a line of code to load handlebars-helpers in server.js

```javascript
// Register handlebar helpers
require('./views/helpers')
```

- Remove the handlebars helper if you have one

```hbs
  <<globalSettingsForBrowserJS>>
```

- remove /buildConfig.js

- remove npm script `"buildConfig"` and also remove call to it from `"postinstall"`-hook

- Change config imports in js-files

	var config = require('config') => var config = { config: window.config, paths: window.paths }

- include config in head, should look like this

```hbs
{{prefixScript '/static/js/vendor.js' 'head-scripts'}}
{{prefixScript '/static/browserConfig' 'head-scripts'}}
```

## TODO ##
TODO - add test for decodeUri.js

TODO - add test for utils.js

TODO - add test for unpackLDAPConfig.js

TODO - add test for generateConfig.js

TODO - add test for getHandler.js

## DONE ##
DONE - add test for unpackNodeApiConfig.js

DONE - add test for unpackMongodbConfig.js

DONE - add test for unpackRedisConfig.js
