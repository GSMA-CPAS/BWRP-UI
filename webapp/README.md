# Webapp

Build docker image

<pre>
$ docker build --no-cache -t webapp .
</pre>

## Installation (local development outside docker network)

**Install app-roaming**

<pre>
$ cd webapp/app-roaming
$ npm install
$ NODE_ENV=production npm run build
$ npm link
</pre>

**Install app-core**

<pre>
$ cd webapp/app-core
$ npm install
$ npm run build
$ npm link app-roaming
</pre>

**Configuration**

Create config file ``production-org1.json`` in folder ``webapp/app-core/config``.

<pre>
{
    "organization": {
        "mspid": "ORG1",
        "title": "Name of organization"
    },
    
    "log": {
        "level": "debug"
    },
    
    "session": {
        "secret": "secret123",
        "cookie": {
            "secure": false
        }
    },

    "database": {
        "connection": {
            "host": "127.0.0.1",
            "port": 3306,
            "user": "nomad",
            "password": "secret123",
            "database": "org1"
        }
    },
    
    "apps": {
        "roaming": {
            "name": "roaming",
            "enabled": true,
            "packageName": "app-roaming",
            "displayName": "Roaming",
            "config": {
            }
        }
    },
    "backendAdapters": {
        "CertAuthAdapter": {
            "config": {
                "url": "http://localhost:7054",
                "caName": "ca.nomad.com",
                "adminEnrollmentId": "admin",
                "adminEnrollmentSecret": "secret123",
                "userEnrollmentSecret": "secret123"
            }
        },
        "BlockchainAdapter": {
            "config": {
                "url": "http://localhost:8081",
                "webhooks": [
                    {"eventName": "STORE:DOCUMENTHASH", "callbackUrl": "http://{host}:{port}/api/v1/documents/event"},
                    {"eventName": "STORE:SIGNATURE", "callbackUrl": "http://{host}:{port}/api/v1/signatures/event"}
                ]
            }
        }
    }
}
</pre>

To support hierarchical configurations node-config (https://github.com/lorenwest/node-config) is used. 

**Setup**

* creates database tables: documents, sessions, users
* creates admin user + certificate via fabric ca
* subscribes webhook events

<pre>
$ cd webapp/app-core
$ NODE_ENV=production-org1 node setup.js
</pre>

**Start webapp**

<pre>
$ cd webapp/app-core
$ NODE_ENV=production-org1 PORT=3040 node server.js
</pre>
