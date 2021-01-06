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

``NODE_ENV=production`` with ``npm run build`` important for setting correct ``publicPath`` (see webapp/app-roaming/vue.config.js)

**Install app-core**

<pre>
$ cd webapp/app-core
$ npm install
$ npm run build
$ npm link app-roaming
</pre>

**Configuration**

Create config file ``development-org1.json`` in folder ``webapp/app-core/config``.

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
    
    "services": {
        "SwaggerService": {
            "enabled": true
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
        "CommonAdapter": {
            "config": {
                "url": "http://localhost:3030"
            }
        }
    }
}
</pre>
 
NPM package ``config`` (https://github.com/lorenwest/node-config) is used to support hierarchical configurations.

**Setup**

* creates database tables: documents, sessions, users
* creates admin user + certificate via fabric ca
* subscribes webhook events

<pre>
$ cd webapp/app-core
$ NODE_ENV=development-org1 node setup.js
</pre>

**Start webapp**

<pre>
$ cd webapp/app-core
$ NODE_ENV=development-org1 node server.js
-> http://localhost:3000
</pre>

Sign-in:

<pre>
Username: admin
Password: admin
</pre>