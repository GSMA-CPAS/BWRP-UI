'use strict';

const fs = require('fs');
const cors = require('cors');
const express = require('express');
const config = require('config');

const logger = require(global.GLOBAL_BACKEND_ROOT + '/libs/logger')(config);
const errorHandler = require(global.GLOBAL_BACKEND_ROOT + '/libs/errorhandler');

class AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    if (new.target === AbstractService) {
      throw new TypeError('Cannot construct AbstractService instances directly');
    }

    this.app = app;
    this.database = database;
    this.serviceName = serviceName;
    this.serviceConfig = serviceConfig;
    this.logger = logger;

    this.backendAdapters = {};

    if (serviceConfig.has('useBackendAdapters')) {
      const backendAdapters = serviceConfig.get('useBackendAdapters');
      for (let i = 0; i < backendAdapters.length; i++) {
        const adapterType = backendAdapters[i].type;
        const adapterName = backendAdapters[i].name;
        if (adapterType && adapterName) {
          if (config.has('backendAdapters.' + adapterName)) {
            const adapterConfig = config.get('backendAdapters.' + adapterName);
            const adapterClassPath = global.GLOBAL_BACKEND_ROOT + adapterConfig.get('classPath');
            try {
              fs.statSync(adapterClassPath + '.js');
              const BackendAdapter = require(adapterClassPath);
              this.backendAdapters[adapterType] = new BackendAdapter(adapterName, adapterConfig.config, database);
              this.logger.info('[%s] adapter <%s> successfully loaded - class path <%s>', this.serviceName, adapterName, adapterClassPath);
            } catch (error) {
              this.logger.error('[%s] failed to load adapter <%s> - %s', this.serviceName, adapterName, error.message);
              process.exit(1);
            }
          }
        }
      }
    }

    this.corsEnabled = serviceConfig.has('cors') ?
        serviceConfig.get('cors.enabled') :
        false;

    this.router = new express.Router();

    if (this.corsEnabled) {
      this.router.use(cors(this.serviceConfig.cors));
    }
  }

  getBackendAdapter(type) {
    if (type) {
      const backendAdapter = this.backendAdapters[type];
      if (backendAdapter) {
        return backendAdapter;
      } else {
        this.logger.error('[%s] unknown backend adapter type <%s>', this.getClassName(), type);
      }
    } else {
      this.logger.error('[%s] backend adapter type must be specified', this.getClassName());
    }
  }

  getApp() {
    return this.app;
  }

  getDatabase() {
    return this.database;
  }

  getServiceName() {
    return this.serviceName;
  }

  getServiceConfig() {
    return this.serviceConfig;
  }

  getRouter() {
    return this.router;
  }

  getLogger() {
    return this.logger;
  }

  getClassName() {
    return this.constructor.name;
  }

  handleError(res, error) {
    if (res && res.req) {
      errorHandler(res, error, this.getClassName() + ' ' + res.req.method + ' ' + res.req.originalUrl);
    } else {
      errorHandler(res, error, this.getClassName());
    }
  }

  requiredAdapterType(type) {
    if (this.serviceConfig.has('useBackendAdapters')) {
      const backendAdapters = this.serviceConfig.get('useBackendAdapters');
      const adapter = backendAdapters.find((x) => x.type === type);
      if (!adapter) {
        this.logger.error(
            '[%s] backend adapter type <%s> must be specified for <%s> in config file',
            this.getClassName(), type, this.getClassName());
        process.exit(1);
      } else {
        if (adapter.name) {
          if (!config.has('backendAdapters.' + adapter.name)) {
            this.logger.error(
                '[%s] backend adapter <%s> not found in config file',
                this.getClassName(), adapter.name);
            process.exit(1);
          }
        } else {
          this.logger.error(
              '[%s] Missing name of backend adapter for type <%s> in config file',
              this.getClassName(), type);
          process.exit(1);
        }
      }
    }
  }
}

module.exports = AbstractService;
