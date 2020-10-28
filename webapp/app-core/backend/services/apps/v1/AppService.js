'use strict';

const config = require('config');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class AppService extends AbstractService {

    constructor(serviceName, serviceConfig, app, database) {
        super(serviceName, serviceConfig, app, database);
        this.registerRequestHandler();
    }

    registerRequestHandler() {

        this.getRouter().get('/', ensureAuthenticated, (req, res) => {
            let apps = { ... config.get('apps') };
            let appSize = 0;
            for (let key in apps) {
                if (!apps.hasOwnProperty(key)) continue;
                if (!apps[key].enabled) {
                    delete apps[key];
                } else {
                    let adminOnly = (apps[key].adminOnly) ? apps[key].adminOnly : false;
                    if (adminOnly && !req.user.isAdmin) {
                        delete apps[key];
                    } else {
                        appSize++;
                    }
                }
            }
            res.json({
                apps: apps,
                appSize: appSize
            });
        });

        this.getRouter().get('/:name', ensureAuthenticated, (req, res) => {
            const appName = req.params.name;
            if (config.has('apps.' + appName)) {
                const appConfig = config.get('apps.' + appName);
                res.json({
                    app: appConfig
                })
            } else {
                this.handleError(res, new Error(JSON.stringify({
                    code: ErrorCodes.ERR_NOT_FOUND,
                    message: 'App ' + appName + ' not found'
                })), 'GET /:name');
            }
        });
    }
}

module.exports = AppService;