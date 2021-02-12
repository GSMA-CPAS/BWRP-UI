# Webapp

## Webapp Development

**Requirements**

* Development environment (BWRP-development-setup) is set up und running
* Node & npm is installed

**Install app-roaming**

App for roaming contract, signing, usage data upload and settlement. Will be loaded in an IFrame of app-core later.

<pre>
$ cd webapp/app-roaming
$ npm install
$ npm run build
$ npm link
</pre>

**Install app-core**

Core app for user, session, account and app management.

<pre>
$ cd webapp/app-core
$ npm install
$ npm run build
$ npm link app-roaming
</pre>

**Configuration**

Example development configuration for DTAG organization. Create config file ``development-dtag.json`` in folder ``webapp/app-core/config``. Values with square brackets ([]) must be adjusted according to the ``BWRP-developmet-setup/.env`` file. 

<pre>
{
    "organization": {
        "mspid": "DTAG",
        "title": "Deutsche Telekom"
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
            "password": "[DTAG_WEBAPP_DB_PASSWORD]",
            "database": "dtag"
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
                "adminEnrollmentSecret": "[DTAG_CA_ADMIN_ENROLLMENT_SECRET]",
                "userEnrollmentSecret": "[DTAG_CA_USER_ENROLLMENT_SECRET]"
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
 
**Setup**

* [app-core] creates database tables for session and user management
* [app-core] creates admin user + certificate via fabric ca
* [app-roaming] creates database tables for tadig codes and tadig group management
* [app-roaming] imports tadig codes from csv file into table tadig_codes


<pre>
$ cd webapp/app-core
$ NODE_ENV=development-dtag node setup.js
</pre>

**Start webapp**

<pre>
$ cd webapp/app-core
$ NODE_ENV=development-dtag node server.js
-> http://localhost:3000
</pre>

Sign-in:

<pre>
Username: admin
Password: admin
</pre>