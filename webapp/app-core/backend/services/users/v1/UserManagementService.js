'use strict';

const config = require('config');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/middlewares/auth').ensureAuthenticated;
const ensureAuthenticatedWithPassword = require(global.GLOBAL_BACKEND_ROOT + '/middlewares/auth').ensureAuthenticatedWithPassword;
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/middlewares/auth').ensureAdminAuthenticated;

class UserManagementService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('users');
    this.sessionName = config.get('session').name;
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    /**
     * GET ALL USERS - ADMIN ONLY
     */
    this.getRouter().get('/', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('users').getUsers();
        res.json(result);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * GET USER BY ID - ADMIN ONLY
     */
    this.getRouter().get('/:userId', ensureAdminAuthenticated, async (req, res) => {
      const userId = req.params.userId;
      try {
        const result = await this.getBackendAdapter('users').getUserById(userId);
        const identities = await this.getBackendAdapter('users').getUserIdentities(userId);
        if (identities) {
          result['identities'] = identities;
        } else {
          result['identities'] = [];
        }
        res.json(result);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * CREATE NEW USER - ADMIN ONLY
     */
    this.getRouter().post('/', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('users').createUser(req.user, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * UPDATE USER - ADMIN ONLY
     */
    this.getRouter().put('/:userId', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('users').updateUser(req.params.userId, req.body);
        res.json(result);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * DELETE USER - ADMIN ONLY
     */
    this.getRouter().delete('/:userId', ensureAdminAuthenticated, async (req, res) => {
      const userId = req.params.userId;
      try {
        await this.getBackendAdapter('users').deleteUser(req.user, parseInt(userId));
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * GET IDENTITIES
     */
    this.getRouter().get('/self/identities', ensureAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('users').getUserIdentities(req.user.id, false);
        res.json(result);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * GET IDENTITIES BY USER ID - ADMIN ONLY
     */
    this.getRouter().get('/:userId/identities', ensureAdminAuthenticated, async (req, res) => {
      try {
        const result = await this.getBackendAdapter('users').getUserIdentities(req.params.userId);
        res.json(result);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * ADD IDENTITIES - ADMIN ONLY
     */
    this.getRouter().post('/:userId/identities', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('users').addIdentities(req.params.userId, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * REMOVE IDENTITIES - ADMIN ONLY
     */
    this.getRouter().delete('/:userId/identities', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('users').removeIdentities(req.params.userId, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * CHANGE PASSWORD
     */
    this.getRouter().post('/password/change', ensureAuthenticatedWithPassword, async (req, res) => {
      try {
        await this.getBackendAdapter('users').updatePassword(req.user, req.body);
        req.logout();
        req.session.destroy(() => {
          res.clearCookie(this.sessionName);
          res.json({success: true});
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * RESET PASSWORD - ADMIN ONLY
     */
    this.getRouter().post('/password/reset', ensureAdminAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('users').resetPassword(req.user, req.body);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * GENERATE 2FA SECRET & QR CODE
     */
    this.getRouter().get('/2fa/generate', ensureAuthenticated, async (req, res) => {
      try {
        const secret = await this.getBackendAdapter('users').generateTwoFactorSecret(req.user);
        res.json(secret);
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * ENABLE 2FA
     */
    this.getRouter().post('/2fa/enable', ensureAuthenticated, async (req, res) => {
      try {
        const success = await this.getBackendAdapter('users').enableTwoFactor(req.user, req.body);
        res.json({success: success});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * DISABLE 2FA
     */
    this.getRouter().post('/2fa/disable', ensureAuthenticated, async (req, res) => {
      try {
        await this.getBackendAdapter('users').disableTwoFactor(req.user);
        res.json({success: true});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * STATUS 2FA
     */
    this.getRouter().get('/2fa/status', ensureAuthenticated, async (req, res) => {
      try {
        const status = await this.getBackendAdapter('users').statusTwoFactor(req.user);
        res.json({success: true, isEnabled: status.isEnabled});
      } catch (error) {
        this.handleError(res, error);
      }
    });

    /**
     * VERIFY 2FA
     */
    this.getRouter().post('/2fa/verify', ensureAuthenticatedWithPassword, async (req, res) => {
      try {
        const valid = await this.getBackendAdapter('users').verifyTwoFactor(req.user, req.body);
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
              'organization': config.get('organization')
            }
          });
        } else {
          res.json({'success': false});
        }
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }
}

module.exports = UserManagementService;
