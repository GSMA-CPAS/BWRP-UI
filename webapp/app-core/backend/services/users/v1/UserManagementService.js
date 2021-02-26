'use strict';

const config = require('config');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;
const ensureAuthenticatedWithPassword = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticatedWithPassword;
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAdminAuthenticated;

class UserManagementService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('userManagement');
    this.sessionName = config.get('session').name;
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    /**
     * GET ALL USERS - ADMIN ONLY
     */
    this.getRouter().get('/', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('userManagement').getUsers();
        res.json(result);
      } catch (error) {
        this.handleError(res, error, 'GET /');
      }
    });

    /**
     * GET USER BY ID - ADMIN ONLY
     */
    this.getRouter().get('/:userId', ensureAdminAuthenticated, async (req, res) => {
      const userId = req.params.userId;
      try {
        const result = await this.getBackendAdapter('userManagement').getUserById(userId);
        const identities = await this.getBackendAdapter('userManagement').getUserIdentities(userId);
        if (identities) {
          result['identities'] = identities;
        } else {
          result['identities'] = [];
        }
        res.json(result);
      } catch (error) {
        this.handleError(res, error, 'GET /:userId');
      }
    });

    /**
     * CREATE NEW USER - ADMIN ONLY
     */
    this.getRouter().post('/', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').createUser(req.user, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'POST /');
      }
    });

    /**
     * UPDATE USER - ADMIN ONLY
     */
    this.getRouter().put('/:userId', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').updateUser(req.params.userId, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'PUT /:userId');
      }
    });

    /**
     * DELETE USER - ADMIN ONLY
     */
    this.getRouter().delete('/:userId', ensureAdminAuthenticated, async (req, res) => {
      const userId = req.params.userId;
      try {
        await this.getBackendAdapter('userManagement').deleteUser(req.user, parseInt(userId));
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'DELETE /:userId');
      }
    });

    /**
     * GET IDENTITIES - ADMIN ONLY
     */
    this.getRouter().get('/:userId/identities', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('userManagement').getUserIdentities(req.params.userId);
        res.json(result);
      } catch (error) {
        this.handleError(res, error, 'GET /:userId/identities');
      }
    });

    /**
     * ADD IDENTITIES - ADMIN ONLY
     */
    this.getRouter().post('/:userId/identities', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').addIdentities(req.params.userId, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'POST /:userId/identities');
      }
    });

    /**
     * REMOVE IDENTITIES - ADMIN ONLY
     */
    this.getRouter().delete('/:userId/identities', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').removeIdentities(req.params.userId, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'POST /:userId/identities');
      }
    });

    /**
     * ENROLL USER - ADMIN ONLY
     */
    /* this.getRouter().post('/enroll', ensureAuthenticated, async (req, res) => {
      try {
        const enrollmentId = req.body.enrollmentId;
        const userIdentity = await this.getBackendAdapter('certAuth').enrollUser(enrollmentId);
        await this.getBackendAdapter('wallet').putIdentity(enrollmentId, userIdentity);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'POST /enroll');
      }
    });*/

    /**
     * CHANGE PASSWORD
     */
    this.getRouter().post('/password/change', ensureAuthenticatedWithPassword, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').updatePassword(req.user, req.body);
        req.logout();
        req.session.destroy(() => {
          res.clearCookie(this.sessionName);
          res.json({success: true});
        });
      } catch (error) {
        this.handleError(res, error, 'POST /password/change');
      }
    });

    /**
     * RESET PASSWORD - ADMIN ONLY
     */
    this.getRouter().post('/password/reset', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').resetPassword(req.user, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'POST /password/reset');
      }
    });

    /**
     * GENERATE 2FA SECRET & QR CODE
     */
    this.getRouter().get('/2fa/generate', ensureAuthenticated, async (req, res) => {
      try {
        const secret = await this.getBackendAdapter('userManagement').generateTwoFactorSecret(req.user);
        res.json(secret);
      } catch (error) {
        this.handleError(res, error, 'GET /2fa/generate');
      }
    });

    /**
     * ENABLE 2FA
     */
    this.getRouter().post('/2fa/enable', ensureAuthenticated, async (req, res) => {
      try {
        const success = await this.getBackendAdapter('userManagement').enableTwoFactor(req.user, req.body);
        res.json({success: success});
      } catch (error) {
        this.handleError(res, error, 'POST /2fa/enable');
      }
    });

    /**
     * DISABLE 2FA
     */
    this.getRouter().post('/2fa/disable', ensureAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('userManagement').disableTwoFactor(req.user);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error, 'POST /2fa/disable');
      }
    });

    /**
     * STATUS 2FA
     */
    this.getRouter().get('/2fa/status', ensureAuthenticated, async (req, res) => {
      try {
        const status = await this.getBackendAdapter('userManagement').statusTwoFactor(req.user);
        res.json({success: true, isEnabled: status.isEnabled});
      } catch (error) {
        this.handleError(res, error, 'GET /2fa/status');
      }
    });

    /**
     * VERIFY 2FA
     */
    this.getRouter().post('/2fa/verify', ensureAuthenticatedWithPassword, async (req, res) => {
      try {
        const valid = await this.getBackendAdapter('userManagement').verifyTwoFactor(req.user, req.body);
        if (valid) {
          req.session.twoFactorRequired = false;
          delete req.session.twoFactorRequired;
          res.json({
            'success': true,
            'appContext': {
              'user': {
                'username': req.user.username,
                'isAdmin': req.user.isAdmin
              },
              'organization': {
                'mspid': config.get('organization').mspid,
                'title': config.get('organization').title
              }
            }
          });
        } else {
          res.json({'success': false});
        }
      } catch (error) {
        this.handleError(res, error, 'POST /2fa/verify');
      }
    });
  }
}

module.exports = UserManagementService;
