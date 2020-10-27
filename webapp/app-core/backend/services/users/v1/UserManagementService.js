'use strict';

const config = require('config');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;
const ensureAuthenticatedWithPassword = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticatedWithPassword;
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAdminAuthenticated;
const errorHandler = require(global.GLOBAL_BACKEND_ROOT + '/libs/errorhandler');
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/cryptoUtils');

class UserManagementService extends AbstractService {

    constructor(serviceName, serviceConfig, app, database) {
        super(serviceName, serviceConfig, app, database);
        this.requiredAdapterType('userManagement');
        this.requiredAdapterType('wallet');
        this.requiredAdapterType('certAuth');
        this.sessionName = config.get('session').name;
        this.registerRequestHandler();
    }

    registerRequestHandler() {

        /**
         * GET ALL USERS - ADMIN ONLY
         */
        this.getRouter().get('/', ensureAdminAuthenticated, async(req, res) => {
            try {
                let result = await this.getBackendAdapter('userManagement').getUsers();
                res.json(result);
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * GET USER BY ID - ADMIN ONLY
         */
        this.getRouter().get('/:userId', ensureAdminAuthenticated, async(req, res) => {
            try {
                let result = await this.getBackendAdapter('userManagement').getUserById(req.params.userId);
                const identity = await this.getBackendAdapter('wallet').getIdentity(result.enrollmentId);
                if (identity) {
                    const certificate = identity.credentials.certificate;
                    result['certificate'] = certificate;
                    result['certificateData'] = cryptoUtils.parseCert(certificate);
                }
                res.json(result);
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * CREATE NEW USER - ADMIN ONLY
         */
        this.getRouter().post('/', ensureAdminAuthenticated, async(req, res) => {
            try {
                const enrollmentId = req.body.username;
                req.body['enrollmentId'] = enrollmentId;
                if(await this.getBackendAdapter('userManagement').createUser(req.user, req.body)) {
                    const canSignDocument = req.body.canSignDocument;
                    const registrar = await this.getBackendAdapter('wallet').getUserContext('admin');
                    await this.getBackendAdapter('certAuth').registerUser(enrollmentId, registrar, canSignDocument);
                    const userIdentity = await this.getBackendAdapter('certAuth').enrollUser(enrollmentId);
                    await this.getBackendAdapter('wallet').putIdentity(enrollmentId, userIdentity);
                    res.json({success: true});
                }
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * UPDATE USER - ADMIN ONLY
         */
        this.getRouter().put('/:userId', ensureAdminAuthenticated, async(req, res) => {
            try {
                await this.getBackendAdapter('userManagement').updateUser(req.params.userId, req.body);
                res.json({success: true});
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * ENROLL USER - ADMIN ONLY
         */
        this.getRouter().post('/enroll', ensureAuthenticated, async(req, res) => {
            try {
                const enrollmentId = req.body.enrollmentId;
                const userIdentity = await this.getBackendAdapter('certAuth').enrollUser(enrollmentId);
                await this.getBackendAdapter('wallet').putIdentity(enrollmentId, userIdentity);
                res.json({success: true});
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * CHANGE PASSWORD
         */
        this.getRouter().post('/password/change', ensureAuthenticatedWithPassword, async(req, res) => {
            try {
                await this.getBackendAdapter('userManagement').updatePassword(req.user, req.body);
                req.logout();
                req.session.destroy(() => {
                    res.clearCookie(this.sessionName);
                    res.json({success: true});
                });
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * RESET PASSWORD - ADMIN ONLY
         */
        this.getRouter().post('/password/reset', ensureAdminAuthenticated, async(req, res) => {
            try {
                await this.getBackendAdapter('userManagement').resetPassword(req.user, req.body);
                res.json({success: true});
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * GENERATE 2FA SECRET & QR CODE
         */
        this.getRouter().get('/2fa/generate', ensureAuthenticated, async(req, res) => {
            try {
                const secret = await this.getBackendAdapter('userManagement').generateTwoFactorSecret(req.user);
                res.json(secret);
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * ENABLE 2FA
         */
        this.getRouter().post('/2fa/enable', ensureAuthenticated, async(req, res) => {
            try {
                const success = await this.getBackendAdapter('userManagement').enableTwoFactor(req.user, req.body);
                res.json({success: success});
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * DISABLE 2FA
         */
        this.getRouter().post('/2fa/disable', ensureAuthenticated, async(req, res) => {
            try {
                await this.getBackendAdapter('userManagement').disableTwoFactor(req.user);
                res.json({success: true});
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * STATUS 2FA
         */
        this.getRouter().get('/2fa/status', ensureAuthenticated, async(req, res) => {
            try {
                const status = await this.getBackendAdapter('userManagement').statusTwoFactor(req.user);
                res.json({success: true, isEnabled: status.isEnabled});
            } catch (error) {
                errorHandler(res, error);
            }
        });

        /**
         * VERIFY 2FA
         */
        this.getRouter().post('/2fa/verify', ensureAuthenticatedWithPassword, async(req, res) => {
            try {
                const valid = await this.getBackendAdapter('userManagement').verifyTwoFactor(req.user, req.body);
                if (valid) {
                    req.session.twoFactorRequired = false;
                    delete req.session.twoFactorRequired;
                    res.json({
                        "success": true,
                        "appContext": {
                            "user": {
                                "username": req.user.username,
                                "isAdmin": req.user.isAdmin
                            },
                            "organization": {
                                "mspid": config.get('organization').mspid,
                                "title": config.get('organization').title
                            }
                        }
                    });
                } else {
                    res.json({"success": false});
                }
            } catch (error) {
                errorHandler(res, error);
            }
        });
    }
}

module.exports = UserManagementService;