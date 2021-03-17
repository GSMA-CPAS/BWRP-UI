# Webapp

[TODO]

## Services

[TODO]

### Proxy Service

Example ``app-core/config/production.json``

<pre>
"services": {
   "ProxyService": {
     "enabled": true,
     "locations": [
       {
         "route": "/blockchain",
         "auth": true,
         "adminOnly": false,
         "proxyOptions": {
           "target": "http://localhost:8081",
           "changeOrigin": true
         }
       }
     ]
   }
}
</pre>

``http://localhost:3000/proxy/blockchain/status`` -> ``http://localhost:8081/status``

### App Service

Example ``app-core/config/production.json``

<pre>
"apps": {
  "roaming": {
    "name": "roaming",
    "enabled": true,
    "packageName": "app-roaming",
    "displayName": "Roaming",
    "config": {
    }
  }
}
</pre>

<pre>
$ cd app-roaming
$ npm link

$ cd app-core
$ npm link app-roaming
</pre>

### Swagger Service

Example ``app-core/config/production.json``

<pre>
"services": {
  "SwaggerService": {
    "enabled": true
  }
}
</pre>

``http://localhost:3000/api/docs``

## Apps

### Development

[TODO]

#### package.json

<pre>
{
  "name": "app-roaming",
  "version": "1.0.0",
  "private": true,
  "main": "app.js"
}
</pre>

#### app.js

Called when server is started (node app-core/server.js)

<pre>
exports.onLoad = async (app, router, database, logger, config) => {
}
</pre>

Called when setup is executed (node app-core/setup.js)

<pre>
exports.onSetup = async (database, logger, config) => {
}
</pre>

