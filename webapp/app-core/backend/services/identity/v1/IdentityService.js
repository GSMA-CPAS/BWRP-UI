'use strict';

const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAdminAuthenticated;
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/cryptoUtils');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

class IdentityService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    this.getRouter().get('/', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('identity').getIdentities();
        res.json(result);
      } catch (error) {
        this.handleError(res, error, 'GET /');
      }
    });

    this.getRouter().get('/:id', ensureAdminAuthenticated, async (req, res) => {
      try {
        const identity = await this.getBackendAdapter('identity').getIdentity(req.params.id);
        let walletIdentity = await this.getBackendAdapter('wallet').getIdentity(identity.name);
        if (!walletIdentity) {
          walletIdentity = await this.getBackendAdapter('certAuth').enrollUser(identity.name);
          await this.getBackendAdapter('wallet').putIdentity(identity.name, walletIdentity);
        }
        const certificate = walletIdentity.credentials.certificate;
        identity['x509'] = cryptoUtils.parseCert(certificate);
        identity['certificate'] = certificate;
        res.json(identity);
      } catch (error) {
        this.handleError(res, error, 'GET /:id');
      }
    });

    this.getRouter().post('/', ensureAdminAuthenticated, async (req, res) => {
      const identityName = req.body.name;
      if (!identityName) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_MISSING_PARAMETER,
          message: 'Missing parameter: name',
        })), 'POST /');
      }
      if (identityName === this.getBackendAdapter('certAuth').getAdminEnrollmentId()) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_VALIDATION,
          message: identityName + ' is reserved for admin identity',
        })), 'POST /');
      }
      let createdIdentityResult;
      try {
        if (await this.getBackendAdapter('identity').existsIdentity(identityName)) {
          return this.handleError(res, new Error(JSON.stringify({
            code: ErrorCodes.ERR_DUPLICATE_ENTRY,
            message: 'Identity already exists',
          })), 'POST /');
        } else {
          createdIdentityResult = await this.getBackendAdapter('identity').createIdentity(req.body);
          const adminEnrollmentId = this.getBackendAdapter('certAuth').getAdminEnrollmentId();
          const registrar = await this.getBackendAdapter('wallet').getUserContext(adminEnrollmentId);
          if (!await this.getBackendAdapter('certAuth').existsIdentity(identityName, registrar)) {
            await this.getBackendAdapter('certAuth').registerUser(identityName, registrar, true);
          }
          const identity = await this.getBackendAdapter('certAuth').enrollUser(identityName);
          await this.getBackendAdapter('wallet').putIdentity(identityName, identity);
          return res.json({success: true});
        }
      } catch (error) {
        if (createdIdentityResult && createdIdentityResult.insertId > 0) {
          await this.getBackendAdapter('identity').deleteIdentity(createdIdentityResult.insertId);
        }
        this.handleError(res, error, 'POST /');
      }
    });

    this.getRouter().delete('/:id', ensureAdminAuthenticated, async (req, res) => {
      try {
        const identity = await this.getBackendAdapter('identity').getIdentity(req.params.id);
        await this.getBackendAdapter('wallet').removeIdentity(identity.name);
        await this.getBackendAdapter('identity').deleteIdentity(req.params.id);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'DELETE /:identityId');
      }
    });

    this.getRouter().post('/:id/renew', ensureAdminAuthenticated, async (req, res) => {
      try {
        const identity = await this.getBackendAdapter('identity').getIdentity(req.params.id);
        const newIdentity = await this.getBackendAdapter('certAuth').enrollUser(identity.name);
        await this.getBackendAdapter('wallet').putIdentity(identity.name, newIdentity);
        return res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'DELETE /:identityId');
      }
    });
  }
}

module.exports = IdentityService;
