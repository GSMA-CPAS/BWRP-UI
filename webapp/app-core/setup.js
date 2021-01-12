'use strict';

const fs = require('fs');
const path = require('path');
const config = require('config');
const Database = require('mysqlw');

global.GLOBAL_ROOT = path.resolve(__dirname);
global.GLOBAL_BACKEND_ROOT = path.resolve(__dirname, './backend');

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
    console.error(error.message);
    throw error;
  }

  // initialize FabricUserManagementAdapter

  const walletAdapter = createAdapterInstance('WalletAdapter', database);
  const certAuthAdapter = createAdapterInstance('CertAuthAdapter', database);
  const userManagementAdapter = createAdapterInstance('UserManagementAdapter', database);
  try {
    if (await userManagementAdapter.initialize()) {
      const adminIdentity = await certAuthAdapter.enrollAdmin();
      await walletAdapter.putIdentity('admin', adminIdentity);
      await userManagementAdapter.createAdmin();
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }

  // initialize BlockchainAdapter

  if (isAdapterUsedByService('BlockchainAdapter')) {
    const blockchainAdapter = createAdapterInstance('BlockchainAdapter', database);
    try {
      await blockchainAdapter.initialize();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // initialize LocalStorageAdapter

  if (isAdapterUsedByService('LocalStorageAdapter')) {
    const localStorageAdapter = createAdapterInstance('LocalStorageAdapter', database);
    try {
      await localStorageAdapter.initialize();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // close database

  database.close((error) => {
    if (error) {
      console.error(error);
    }
  });
};

setup().then(() => {
  console.log('[Setup] Setup completed!');
}).catch((error) => {
  console.error('[Setup] ' + error.message);
  process.exit(1);
});
