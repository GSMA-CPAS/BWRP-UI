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
  "secret": "secret123!"
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

#### CSP Directives

Default (default.json)

<pre>
"cspDirectives": {
  "defaultSrc": ["'self'"],
  "styleSrc": ["'self'", "'unsafe-inline'"],
  "imgSrc": ["'self'", "data:"],
  "childSrc": ["'self'", "blob:"]
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
    "password": "secret123!",
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

### Services / Adapters

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

#### User Management Adapter

Default (default.json)

<pre>
"backendAdapters": {
  "UserManagementAdapter": {
    "config": {
      "initialAdminPassword": "admin",
      "passwordHashOptions" : {
        "type": "argon2id",
        "timeCost": 256,
        "memoryCost": 1024,
        "parallelism": 1,
        "saltLength": 32
      },
      "passwordKeyDerivationOptions" : {
        "type": "argon2id",
        "timeCost": 4096,
        "memoryCost": 9,
        "parallelism": 1,
        "saltLength": 32
      }
    }
  }
}
</pre>

Example (production.json)

<pre>
"backendAdapters": {
  "UserManagementAdapter": {
    "config": {
      "initialAdminPassword": "secret123!"
    }
  }
}
</pre>

#### Common Adapter

Example (production.json)

<pre>
"backendAdapters": {
  "CommonAdapter": {
    "config": {
      "url": "http://common-adapter-dtag:3000"
    }
  }
}
</pre>

#### HSM

Default (default.json)

<pre>
"backendAdapters": {
  "CertAuthAdapter": {
    "config": {
      "hsm": {
         "enabled": false,
         "lib": "/usr/local/lib/softhsm/libsofthsm2.so",
         "pin": "",
         "slot": 0,
         "usertype": 1,
         "readwrite": false
      }
    }
  }
}
</pre>

Example (production.json)

<pre>
"backendAdapters": {
  "CertAuthAdapter": {
    "config": {
      "hsm": {
         "enabled": true,
         "lib": "/usr/local/lib/softhsm/libsofthsm2.so",
         "pin": "71811222"
      }
    }
  }
}
</pre>


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

