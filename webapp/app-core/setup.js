'use strict';

const fs = require('fs');
const path = require('path');
const config = require('config');
const Database = require('mysqlw');

global.GLOBAL_ROOT = path.resolve(__dirname);
global.GLOBAL_BACKEND_ROOT = path.resolve(__dirname, './backend');
const logger = require(global.GLOBAL_BACKEND_ROOT + '/libs/logger')(config);

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

  // initialize SessionManagementAdapter

  const sessionManagementAdapter = createAdapterInstance('SessionManagementAdapter', database);
  try {
    await sessionManagementAdapter.initialize();
  } catch (error) {
    logger.error(error.message);
    throw error;
  }

  // initialize UserManagementAdapter

  const userManagementAdapter = createAdapterInstance('UserManagementAdapter', database);
  try {
    await userManagementAdapter.initialize();
  } catch (error) {
    logger.error(error.message);
    throw error;
  }

  // create admin user / enroll admin identity

  const walletAdapter = createAdapterInstance('WalletAdapter', database);
  const certAuthAdapter = createAdapterInstance('CertAuthAdapter', database);
  try {
    if (!await userManagementAdapter.existsUser('admin')) {
      await userManagementAdapter.createAdmin();
    }
    const adminEnrollmentId = certAuthAdapter.getAdminEnrollmentId();
    const adminIdentity = await walletAdapter.getIdentity(adminEnrollmentId);
    if (!adminIdentity) {
      const adminIdentity = await certAuthAdapter.enrollAdmin();
      await walletAdapter.putIdentity(adminEnrollmentId, adminIdentity);
    }
  } catch (error) {
    logger.error(error.message);
    throw error;
  }

  // initialize IdentityAdapter

  const identityAdapter = createAdapterInstance('IdentityAdapter', database);
  try {
    await identityAdapter.initialize();
  } catch (error) {
    logger.error(error.message);
    throw error;
  }

  // initialize BlockchainAdapter

  if (isAdapterUsedByService('BlockchainAdapter')) {
    const blockchainAdapter = createAdapterInstance('BlockchainAdapter', database);
    try {
      await blockchainAdapter.initialize();
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  // initialize LocalStorageAdapter

  if (isAdapterUsedByService('LocalStorageAdapter')) {
    const localStorageAdapter = createAdapterInstance('LocalStorageAdapter', database);
    try {
      await localStorageAdapter.initialize();
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  // initialize apps

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
