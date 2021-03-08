'use strict';

const config = require('config');
const FabricCAServices = require('fabric-ca-client');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

class CertAuthAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
    this.mspid = config.organization.mspid;
    this.url = this.getAdapterConfig().get('url');
    this.caName = this.getAdapterConfig().get('caName');
    this.adminEnrollmentId = this.getAdapterConfig().get('adminEnrollmentId');
    this.adminEnrollmentSecret = this.getAdapterConfig().get('adminEnrollmentSecret');
    this.userEnrollmentSecret = this.getAdapterConfig().get('userEnrollmentSecret');
    this.userEnrollmentRole = this.getAdapterConfig().get('userEnrollmentRole');
    this.userEnrollmentAffiliation = this.getAdapterConfig().get('userEnrollmentAffiliation');
    this.userEnrollmentMax = this.getAdapterConfig().get('userEnrollmentMax');
    this.ca = new FabricCAServices(this.url, {trustedRoots: [], verify: false}, this.caName);
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
          {name: 'CanSign', value: 'yes', ecert: true}
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
        type: 'X.509'
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
      type: 'X.509'
    };
  }

  getAdminEnrollmentId() {
    return this.adminEnrollmentId;
  }
}

module.exports = CertAuthAdapter;
