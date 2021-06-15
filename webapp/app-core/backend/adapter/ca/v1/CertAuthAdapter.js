'use strict';

const config = require('config');
const {Wallets, HsmX509Provider} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

class CertAuthAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
    this.mspid = config.get('organization').mspid;
    this.url = adapterConfig.get('url');
    this.caName = adapterConfig.get('caName');
    this.identityType = adapterConfig.get('identityType');
    this.adminEnrollmentId = adapterConfig.get('adminEnrollmentId');
    this.adminEnrollmentSecret = adapterConfig.get('adminEnrollmentSecret');
    this.userEnrollmentSecret = adapterConfig.get('userEnrollmentSecret');
    this.userEnrollmentRole = adapterConfig.get('userEnrollmentRole');
    this.userEnrollmentAffiliation = adapterConfig.get('userEnrollmentAffiliation');
    this.userEnrollmentMax = adapterConfig.get('userEnrollmentMax');
  }

  async onLoad() {
    try {
     this.wallet = await Wallets.newFileSystemWallet(global.GLOBAL_ROOT + '/wallet');
      if (this.getAdapterConfig().get('hsm').enabled) {
        const hsmX509Provider = new HsmX509Provider({
          lib: this.getAdapterConfig().get('hsm').lib,
          pin: this.getAdapterConfig().get('hsm').pin,
          slot: this.getAdapterConfig().get('hsm').slot,
        });
        this.wallet.getProviderRegistry().addProvider(hsmX509Provider);
        this.ca = new FabricCAServices(this.url, this.getAdapterConfig().get('tlsOptions'), this.caName, hsmX509Provider.getCryptoSuite());
      } else {
        this.ca = new FabricCAServices(this.url, this.getAdapterConfig().get('tlsOptions'), this.caName);
      }
    } catch (error) {
      this.getLogger().error('[CertAuthAdapter::onLoad] %s', error.message);
    }
  }

  async register(enrollmentId, registrar, canSign = false) {
    try {
      const registerRequest = {
        enrollmentID: enrollmentId,
        enrollmentSecret: this.userEnrollmentSecret,
        affiliation: this.userEnrollmentAffiliation,
        maxEnrollments: this.userEnrollmentMax,
        role: this.userEnrollmentRole
      };
      if (canSign === true) {
        registerRequest['attrs'] = [
          {name: 'CanSignDocument', value: 'yes', ecert: true}
        ];
      }
      return await this.ca.register(registerRequest, registrar);
    } catch (error) {
      this.getLogger().error('[CertAuthAdapter::register] failed to register identity %s - %s', enrollmentId, error.message);
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_CA_IDENTITY,
        message: 'Failed to register identity ' + enrollmentId
      }));
    }
  }

  async enroll(enrollmentId) {
    try {
      const enrollment = await this.ca.enroll({
        enrollmentID: enrollmentId,
        enrollmentSecret: this.userEnrollmentSecret,
      });
      this.getLogger().info('[CertAuthAdapter::enroll] identity %s has been enrolled successfully!', enrollmentId);
      return {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes()
        },
        mspId: this.mspid,
        type: this.identityType
      };
    } catch (error) {
      this.getLogger().error('[CertAuthAdapter::enroll] failed to enroll identity %s - %s', enrollmentId, error.message);
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_CA_IDENTITY,
        message: 'Failed to enroll identity ' + enrollmentId
      }));
    }
  }

  async existsIdentity(enrollmentId, registrar) {
    try {
      const identityService = this.ca.newIdentityService();
      await identityService.getOne(enrollmentId, registrar);
      return true;
    } catch (error) {
      return false;
    }
  }

  async enrollAdmin() {
    const enrollment = await this.ca.enroll({
      enrollmentID: this.adminEnrollmentId,
      enrollmentSecret: this.adminEnrollmentSecret,
    });
    this.getLogger().info('[CertAuthAdapter::enrollAdmin] %s has been enrolled successfully!', this.adminEnrollmentId);
    return {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: this.mspid,
      type: this.identityType
    };
  }

  getAdminEnrollmentId() {
    return this.adminEnrollmentId;
  }

  async getUserContext(enrollmentId) {
    try {
      const identity = await this.getWalletIdentity(enrollmentId);
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
      this.getLogger().error('[CertAuthAdapter::getUserContext] failed to get user context for %s - %s', enrollmentId, error.message);
      throw error;
    }
  }

  async getWalletIdentity(enrollmentId) {
    return await this.wallet.get(enrollmentId);
  }

  async putWalletIdentity(enrollmentId, identity) {
    try {
      await this.wallet.put(enrollmentId, identity);
    } catch (error) {
      this.getLogger().error('[CertAuthAdapter::putIdentity] failed to put identity %s - %s', enrollmentId, error.message);
      throw error;
    }
  }

  async removeWalletIdentity(enrollmentId) {
    try {
      if (await this.wallet.get(enrollmentId)) {
        await this.wallet.remove(enrollmentId);
      }
    } catch (error) {
      this.getLogger().error('[CertAuthAdapter::removeIdentity] failed to remove identity %s - %s', enrollmentId, error.message);
      throw error;
    }
  }
}

module.exports = CertAuthAdapter;
