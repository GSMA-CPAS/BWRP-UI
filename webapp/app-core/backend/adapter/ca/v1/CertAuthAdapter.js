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
        this.adminEnrollmentSecret = this.getAdapterConfig().get('adminEnrollmentSecret');
        this.userEnrollmentSecret = this.getAdapterConfig().get('userEnrollmentSecret')
        this.ca = new FabricCAServices(this.url, { trustedRoots: [], verify: false }, this.caName);
    }

    async registerAndEnrollUser(enrollmentId, registrar) {
        let enrollment;
        if (await this.existsIdentity(enrollmentId, registrar)) {
            try {
                enrollment = await this.ca.enroll({ enrollmentID: enrollmentId, enrollmentSecret:  this.userEnrollmentSecret});
            } catch (error) {
                this.getLogger().error('[CertAuthAdapter::registerAndEnrollUser] failed to enroll identity %s - %', enrollmentId, error.message);
                throw new Error(JSON.stringify({
                    code: ErrorCodes.ERR_CA_USER_ENROLLMENT,
                    message: 'failed to enroll identity ' + enrollmentId
                }));
            }
        } else {
            let secret;
            try {
                secret = await this.ca.register({
                    enrollmentID: enrollmentId,
                    enrollmentSecret: this.userEnrollmentSecret,
                    maxEnrollments: -1,
                    role: 'client'}, registrar);
            } catch (error) {
                this.getLogger().error('[CertAuthAdapter::registerAndEnrollUser] failed to register identity %s - %s', enrollmentId, error.message);
                throw new Error(JSON.stringify({
                    code: ErrorCodes.ERR_CA_USER_REGISTRATION,
                    message: 'failed to register identity ' + enrollmentId
                }));
            }
            try {
                enrollment = await this.ca.enroll({ enrollmentID: enrollmentId, enrollmentSecret: secret });
            } catch (error) {
                this.getLogger().error('[CertAuthAdapter::registerAndEnrollUser] failed to enroll identity %s - %s', enrollmentId, error.message);
                throw new Error(JSON.stringify({
                    code: ErrorCodes.ERR_CA_USER_ENROLLMENT,
                    message: 'failed to enroll identity ' + enrollmentId
                }));
            }
        }
        return {
            credentials: { certificate: enrollment.certificate, privateKey: enrollment.key.toBytes() },
            mspId: this.mspid,
            type: 'X.509'
        };
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
            enrollmentID: 'admin',
            enrollmentSecret: this.adminEnrollmentSecret
        });
        return {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: this.mspid,
            type: 'X.509',
        };
    }
}

module.exports = CertAuthAdapter;