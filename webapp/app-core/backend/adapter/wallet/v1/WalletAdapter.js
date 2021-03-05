'use strict';

const {Wallets} = require('fabric-network');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

class WalletAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
    Wallets.newFileSystemWallet(global.GLOBAL_ROOT + '/wallet').
        then((wallet) => {
          this.wallet = wallet;
        });
  }

  async getIdentity(enrollmentId) {
    return await this.wallet.get(enrollmentId);
  }

  async putIdentity(enrollmentId, identity) {
    try {
      await this.wallet.put(enrollmentId, identity);
    } catch (error) {
      this.getLogger().error('[WalletAdapter::putIdentity] failed to put identity %s - %s', enrollmentId, error.message);
      throw error;
    }
  }

  async removeIdentity(enrollmentId) {
    try {
      if (await this.wallet.get(enrollmentId)) {
        await this.wallet.remove(enrollmentId);
      }
    } catch (error) {
      this.getLogger().error('[WalletAdapter::removeIdentity] failed to remove identity %s - %s', enrollmentId, error.message);
      throw error;
    }
  }

  async getUserContext(enrollmentId) {
    try {
      const identity = await this.getIdentity(enrollmentId);
      if (identity) {
        const provider = this.wallet.getProviderRegistry().getProvider(identity.type);
        return await provider.getUserContext(identity, enrollmentId);
      } else {
        return Promise.reject(new Error(JSON.stringify({
          code: ErrorCodes.ERR_NOT_FOUND,
          message: 'Identity ' + enrollmentId + ' not found in wallet!'
        })));
      }
    } catch (error) {
      this.getLogger().error('[WalletAdapter::getUserContext] failed to get user context for %s - %s', enrollmentId, error.message);
      throw error;
    }
  }
}

module.exports = WalletAdapter;
