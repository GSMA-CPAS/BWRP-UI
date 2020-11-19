'use strict';

const {Wallets} = require('fabric-network');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');

class WalletAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
    Wallets.newFileSystemWallet(global.GLOBAL_ROOT + '/wallet').
        then((wallet) => {
          this.wallet = wallet;
        });
  }

  async getIdentity(enrollmentId) {
    const identity = await this.wallet.get(enrollmentId);
    if (!identity) {
      this.getLogger().error('[WalletAdapter::getIdentity] failed to get identity %s from wallet', enrollmentId);
    }
    return identity;
  }

  async putIdentity(enrollmentId, identity) {
    try {
      await this.wallet.put(enrollmentId, identity);
    } catch (error) {
      this.getLogger().error('[WalletAdapter::putIdentity] failed to put identity %s - %s', enrollmentId, error.message);
      throw error;
    }
  }

  async getUserContext(enrollmentId) {
    try {
      const identity = await this.getIdentity(enrollmentId);
      const provider = this.wallet.getProviderRegistry().getProvider(identity.type);
      return await provider.getUserContext(identity, enrollmentId);
    } catch (error) {
      this.getLogger().error('[WalletAdapter::getUserContext] failed to get user context for %s - %s', enrollmentId, error.message);
      throw error;
    }
  }
}

module.exports = WalletAdapter;
