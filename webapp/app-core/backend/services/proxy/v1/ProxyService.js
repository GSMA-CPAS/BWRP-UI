'use strict';

const {createProxyMiddleware} = require('http-proxy-middleware');

const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAdminAuthenticated;
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class ProxyService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    if (serviceConfig.locations) {
      for (const location of serviceConfig.locations) {
        const proxyOptions = {...location.proxyOptions};
        if (!proxyOptions.pathRewrite) {
          proxyOptions['pathRewrite'] = {};
          proxyOptions['pathRewrite']['^' + serviceConfig.route + location.route] = '/';
        }
        this.getRouter().use(location.route, this.checkAuth(location), createProxyMiddleware(proxyOptions));
      }
    }
  }

  checkAuth(location) {
    return (req, res, next) => {
      if (location.auth && location.adminOnly) {
        ensureAdminAuthenticated(req, res, next);
      } else if (location.auth) {
        ensureAuthenticated(req, res, next);
      } else {
        next();
      }
    };
  }
}

module.exports = ProxyService;
