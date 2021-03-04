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
        const walletIdentity = await this.getBackendAdapter('wallet').getIdentity(identity.name);
        if (walletIdentity && walletIdentity.credentials) {
          const certificate = walletIdentity.credentials.certificate;
          identity['x509'] = cryptoUtils.parseCert(certificate);
          identity['certificate'] = certificate;
        }
        res.json(identity);
      } catch (error) {
        this.handleError(res, error, 'GET /:id');
      }
    });

    this.getRouter().post('/', ensureAdminAuthenticated, async (req, res) => {
      const enrollmentId = req.body.name;
      if (!enrollmentId) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_MISSING_PARAMETER,
          message: 'Missing parameter: name',
        })), 'POST /');
      }
      if (enrollmentId === this.getBackendAdapter('certAuth').getAdminEnrollmentId()) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_VALIDATION,
          message: enrollmentId + ' is reserved for admin identity',
        })), 'POST /');
      }
      try {
        if (await this.getBackendAdapter('identity').existsIdentity(enrollmentId)) {
          return this.handleError(res, new Error(JSON.stringify({
            code: ErrorCodes.ERR_DUPLICATE_ENTRY,
            message: 'Identity already exists',
          })), 'POST /');
        } else {
          await this.getBackendAdapter('identity').createIdentity(req.body);
          const adminEnrollmentId = this.getBackendAdapter('certAuth').getAdminEnrollmentId();
          const registrar = await this.getBackendAdapter('wallet').getUserContext(adminEnrollmentId);
          if (!await this.getBackendAdapter('certAuth').existsIdentity(enrollmentId, registrar)) {
            await this.getBackendAdapter('certAuth').registerUser(enrollmentId, registrar, true);
          }
          const identity = await this.getBackendAdapter('certAuth').enrollUser(enrollmentId);
          await this.getBackendAdapter('wallet').putIdentity(enrollmentId, identity);
          return res.json({success: true});
        }
      } catch (error) {
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
