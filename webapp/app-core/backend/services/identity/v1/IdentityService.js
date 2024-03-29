'use strict';

const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/middlewares/auth').ensureAdminAuthenticated;
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/commons/cryptoUtils');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

class IdentityService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.registerRequestHandler();
    this.requiredAdapterType('certAuth');
    this.requiredAdapterType('identity');
    this.requiredAdapterType('common');
  }

  registerRequestHandler() {
    this.getRouter().get('/', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('identity').getIdentities();
        res.json(result);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    this.getRouter().get('/:id', ensureAdminAuthenticated, async (req, res) => {
      try {
        const identity = await this.getBackendAdapter('identity').getIdentity(req.params.id);
        let walletIdentity = await this.getBackendAdapter('certAuth').getWalletIdentity(identity.name);
        if (!walletIdentity) {
          walletIdentity = await this.getBackendAdapter('certAuth').enroll(identity.name);
          await this.getBackendAdapter('certAuth').putWalletIdentity(identity.name, walletIdentity);
        }
        const certificate = walletIdentity.credentials.certificate;
        identity['x509'] = cryptoUtils.parseCert(certificate);
        identity['certificate'] = certificate;
        res.json(identity);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    this.getRouter().post('/', ensureAdminAuthenticated, async (req, res) => {
      const identityName = req.body.name;
      if (!identityName) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_MISSING_PARAMETER,
          message: 'Missing parameter: name'
        })));
      }
      if (identityName === this.getBackendAdapter('certAuth').getAdminEnrollmentId()) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_VALIDATION,
          message: identityName + ' is reserved for admin identity'
        })));
      }
      let createdIdentityResult;
      try {
        if (await this.getBackendAdapter('identity').existsIdentity(identityName)) {
          return this.handleError(res, new Error(JSON.stringify({
            code: ErrorCodes.ERR_DUPLICATE_ENTRY,
            message: 'Identity already exists'
          })));
        } else {
          createdIdentityResult = await this.getBackendAdapter('identity').createIdentity(req.body);
          const adminEnrollmentId = this.getBackendAdapter('certAuth').getAdminEnrollmentId();
          const registrar = await this.getBackendAdapter('certAuth').getUserContext(adminEnrollmentId);
          if (!await this.getBackendAdapter('certAuth').existsIdentity(identityName, registrar)) {
            await this.getBackendAdapter('certAuth').register(identityName, registrar, true);
          }
          const identity = await this.getBackendAdapter('certAuth').enroll(identityName);
          await this.getBackendAdapter('certAuth').putWalletIdentity(identityName, identity);
          return res.json({success: true});
        }
      } catch (error) {
        if (createdIdentityResult && createdIdentityResult.insertId > 0) {
          await this.getBackendAdapter('identity').deleteIdentity(createdIdentityResult.insertId);
        }
        this.handleError(res, error);
      }
    });

    this.getRouter().delete('/:id', ensureAdminAuthenticated, async (req, res) => {
      try {
        const identity = await this.getBackendAdapter('identity').getIdentity(req.params.id);
        await this.getBackendAdapter('certAuth').removeWalletIdentity(identity.name);
        await this.getBackendAdapter('identity').deleteIdentity(req.params.id);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    this.getRouter().post('/:id/renew', ensureAdminAuthenticated, async (req, res) => {
      try {
        const identity = await this.getBackendAdapter('identity').getIdentity(req.params.id);
        const newIdentity = await this.getBackendAdapter('certAuth').enroll(identity.name);
        await this.getBackendAdapter('certAuth').putWalletIdentity(identity.name, newIdentity);
        return res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    this.getRouter().post('/:id/revoke', ensureAdminAuthenticated, async (req, res) => {
      const identityId = req.params.id;
      try {
        const adminEnrollmentId = this.getBackendAdapter('certAuth').getAdminEnrollmentId();
        const registrar = await this.getBackendAdapter('certAuth').getUserContext(adminEnrollmentId);
        const identity = await this.getBackendAdapter('identity').getIdentity(identityId);
        await this.getBackendAdapter('certAuth').revoke(identity.name, registrar);
        const crl = await this.getBackendAdapter('certAuth').generateCRL(registrar);
        await this.getBackendAdapter('common').revoke(Buffer.from(crl, 'base64').toString('utf-8'));
        await this.getBackendAdapter('identity').setIsRevoked(identityId);
        return res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }
}

module.exports = IdentityService;
