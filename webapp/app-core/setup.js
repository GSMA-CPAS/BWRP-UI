'use strict';

const fs = require('fs');
const path = require('path');
const config = require('config');
const Database = require('mysqlw');

global.GLOBAL_ROOT = path.resolve(__dirname);
global.GLOBAL_BACKEND_ROOT = path.resolve(__dirname, './backend');
const logger = require(global.GLOBAL_BACKEND_ROOT + '/commons/logger')(config);

const createAdapterInstance = (adapterName, database) => {
  const adapterPath = 'backendAdapters.' + adapterName;

  if (!config.has(adapterPath)) {
    throw Error('Failed to create adapter instance - adapter path "' + adapterPath + '" not found in config file');
  }

  const adapterConfigPath = adapterPath + '.config';
  const adapterConfigClassPath = adapterPath + '.classPath';
  const adapterClassPath = global.GLOBAL_BACKEND_ROOT + config.get(adapterConfigClassPath) + '.js';

  try {
    fs.statSync(adapterClassPath);
  } catch (error) {
    throw Error('Failed to create adapter instance - ' + error.message);
  }

  const AdapterClass = require(adapterClassPath);
  return new AdapterClass(adapterName, config.get(adapterConfigPath), database);
};

/**
 * Returns true if given backend adapter is used by a service
 * @param {string} adapterName
 * @return {boolean}
 */
const isAdapterUsedByService = (adapterName) => {
  const services = config.get('services');
  for (const serviceName in services) {
    if (Object.prototype.hasOwnProperty.call(services, serviceName)) {
      if (config.get('services.' + serviceName + '.enabled') === true) {
        const backendAdapters = 'services.' + serviceName + '.useBackendAdapters';
        if (config.has(backendAdapters)) {
          for (const adapter of config.get(backendAdapters)) {
            if (adapter.name === adapterName) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

const setup = async () => {
  const database = new Database(config.get('database'));

  // setup SessionManagementAdapter

  const sessionManagementAdapter = createAdapterInstance('SessionManagementAdapter', database);
  await sessionManagementAdapter.onSetup();

  // setup UserManagementAdapter

  const userManagementAdapter = createAdapterInstance('UserManagementAdapter', database);
  await userManagementAdapter.onSetup();

  // create admin user / enroll admin identity

  if (isAdapterUsedByService('CertAuthAdapter')) {
    const certAuthAdapter = createAdapterInstance('CertAuthAdapter', database);
    if (!await userManagementAdapter.existsUser('admin')) {
      await userManagementAdapter.createAdmin();
    }
    await certAuthAdapter.onLoad();
    const adminEnrollmentId = certAuthAdapter.getAdminEnrollmentId();
    const adminIdentity = await certAuthAdapter.getWalletIdentity(adminEnrollmentId);
    if (!adminIdentity) {
      const adminIdentity = await certAuthAdapter.enrollAdmin();
      await certAuthAdapter.putWalletIdentity(adminEnrollmentId, adminIdentity);
    }
  }

  // setup IdentityAdapter

  if (isAdapterUsedByService('IdentityAdapter')) {
    const identityAdapter = createAdapterInstance('IdentityAdapter', database);
    await identityAdapter.onSetup();
  }

  // setup BlockchainAdapter

  if (isAdapterUsedByService('BlockchainAdapter')) {
    const blockchainAdapter = createAdapterInstance('BlockchainAdapter', database);
    await blockchainAdapter.onSetup();
  }

  // setup LocalStorageAdapter

  if (isAdapterUsedByService('LocalStorageAdapter')) {
    const localStorageAdapter = createAdapterInstance('LocalStorageAdapter', database);
    await localStorageAdapter.onSetup();
  }

  // setup apps

  const moduleApps = config.get('apps');
  for (const moduleAppName in moduleApps) {
    if (!Object.prototype.hasOwnProperty.call(moduleApps, moduleAppName)) continue;
    const appConfig = config.get('apps.' + moduleAppName);
    if (appConfig.enabled) {
      const packageName = appConfig.packageName;
      if (typeof require(packageName).onSetup === 'function') {
        await require(packageName).onSetup(database, logger, appConfig.config);
      }
    }
  }

  // close database

  database.close((error) => {
    if (error) {
      logger.error(error);
    }
  });
};

setup().then(() => {
  logger.info('[Setup] Setup completed!');
}).catch((error) => {
  logger.error('[Setup] ' + error.message);
  process.exit(1);
});
