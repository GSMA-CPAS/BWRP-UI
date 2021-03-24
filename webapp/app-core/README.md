# Webapp

[TODO]

## Configuration

[TODO]

### General

#### Organization

Default (default.json)

<pre>
"organization": {
  "mspid": "",
  "title": ""
}
</pre>

Example (production.json)

<pre>
"organization": {
  "mspid": "DTAG",
  "title": "Deutsche Telekom"
}
</pre>

#### Logging

Default (default.json)

<pre>
"log": {
  "level": "info",
  "file": "",
  "console": true
}
</pre>

#### Session

Default (default.json)

<pre>
"session": {
  "secret": "secret123",
  "name": "nomad.session",
  "resave": false,
  "saveUninitialized": false,
  "rolling": true,
  "timeout": 1800000,
  "checkExpirationInterval": 3600000,
  "cookie": {
    "secure": true
  }
}
</pre>

Example (production.json)

<pre>
"session": {
  "secret": "bd32bwk37rbwrw37br33"
}
</pre>

#### CSRF Protection

Default (default.json)

<pre>
"csrfProtection": {
  "enabled": false,
  "cookie": {
    "secure": true,
    "httpOnly": true
  }
}
</pre>

Example (production.json)

<pre>
"csrfProtection": {
  "enabled": true
}
</pre>

#### Database

Default (default.json)

<pre>
"database": {
  "pooling": true,
  "connection": {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "",
    "password": "",
    "database": ""
  }
}
</pre>

Example (production.json)

<pre>
"database": {
  "connection": {
    "host": "127.0.0.1",
    "port": 3366,
    "user": "nomad",
    "password": "hackme",
    "database": "dtag"
  }
}
</pre>

#### Apps

Default (default.json)

<pre>
"apps": {
}
</pre>

Example (production.json)

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

### Services

#### Proxy Service

Example (production.json)

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

#### Swagger Service

Example (production.json)

<pre>
"services": {
  "SwaggerService": {
    "enabled": true
  }
}
</pre>

``http://localhost:3000/api/docs``

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

