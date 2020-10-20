'use strict';

const config = require('config');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const errorHandler = require(global.GLOBAL_BACKEND_ROOT + '/libs/errorhandler');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const pbkdfUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/pbkdfUtils');
const rateLimit = require("express-rate-limit");

class LoginService extends AbstractService {

    constructor(serviceName, serviceConfig, app, database) {
        super(serviceName, serviceConfig, app, database);
        this.sessionName = config.get('session').name;

        passport.use(new Strategy(
            async (username, password, done) => {
                let user;
                try {
                    user = await this.getBackendAdapter('userManagement').getUserByName(username, false);
                } catch (error) {
                    this.getLogger().error('[LoginService] failed to get user %s - %s', username, error.message);
                    return done(error);
                }

                let passwordVerified = false;
                try {
                    passwordVerified = await this.getBackendAdapter('userManagement').comparePassword(user, password);
                } catch (error) {
                    this.getLogger().error('[LoginService] failed to compare password - %s', error.message);
                    return done(error);
                }

                if (passwordVerified) {
                    if (user.loginAttempts > 0) {
                        try {
                            await this.getBackendAdapter('userManagement').setLoginAttempts(user, 0);
                        } catch (error) {
                            this.getLogger().error('[LoginService] failed to set login attempts - %s', error.message);
                        }
                    }
                    let kek;
                    try {
                        kek = await pbkdfUtils.createKek(password, user.encKey);
                    } catch(error) {
                        this.getLogger().error('[LoginService] failed to generate kek - %s', error.message);
                        return done(error);
                    }
                    return done(null, {
                        id: user.id,
                        username: user.username,
                        isAdmin: (user.username === 'admin'),
                        active: user.active,
                        loginAttempts: user.loginAttempts,
                        mustChangePassword: user.mustChangePassword,
                        twoFactorSecret: user.twoFactorSecret,
                        kek: kek
                    });
                } else {
                    this.getLogger().warn('[LoginService] user %s has entered wrong password', user.username);
                    if (user.active && username !== 'admin') {
                        let loginAttempts = user.loginAttempts + 1;
                        if (loginAttempts >= this.maxLoginAttempts) {
                            const data = { active: false, loginAttempts: 0 };
                            try {
                                await this.getBackendAdapter('userManagement').updateUser(user.id, data);
                                this.getLogger().warn('[LoginService] user %s suspended - max login attempts (%s) exceeded', username, this.maxLoginAttempts);
                            } catch (error) {
                                this.getLogger().error('[LoginService] failed to update user - %s', error.message);
                                return done(error);
                            }
                        } else {
                            try {
                                await this.getBackendAdapter('userManagement').setLoginAttempts(user, loginAttempts);
                            } catch (error) {
                                this.getLogger().error('[LoginService] failed to set login attempt - %s', error.message);
                                return done(error);
                            }
                        }
                    }
                    return done(null, false);
                }
            }
        ));

        passport.serializeUser((user, done) => {
            done(null, {id: user.id, kek: user.kek});
        });

        passport.deserializeUser(async(user, done) => {
            const userId = user.id;
            const kek = user.kek;
            try {
                user = await this.getBackendAdapter('userManagement').getUserById(userId, false);
                user['isAdmin'] = (user.username === 'admin');
            } catch (error) {
                this.getLogger().error('[LoginService::deserializeUser] failed to get user with id %s - %s', userId, error.message);
                return done(null, false);
            }
            //const encKey = user.encKey;
            try {
                //const dek = pbkdfUtils.decryptDek(kek, encKey);
                //user['privateKey'] = pbkdfUtils.decryptData(dek, user.privateKey);
                user['kek'] = kek;
                done(null, user);
            } catch (error) {
                this.getLogger().error('[LoginService::deserializeUser] failed to decrypt key - %s', error.message);
                return done(error);
            }
        });

        this.getApp().use(passport.initialize());
        this.getApp().use(passport.session());

        this.maxLoginAttempts = (serviceConfig.maxLoginAttempts) ? serviceConfig.maxLoginAttempts : 5;

        this.requiredAdapterType('userManagement');
        this.registerRequestHandler();
    }

    registerRequestHandler() {

        let loginLimiter = function(req, res, next) {
            next();
        };

        if (this.getServiceConfig().rateLimit.enabled) {
            loginLimiter = rateLimit({
                message: {"success": false, "message": "Too many login requests from this IP, please try again later"},
                windowMs: this.getServiceConfig().rateLimit.windowMS,
                max: this.getServiceConfig().rateLimit.maxPerIP,
                headers: this.getServiceConfig().rateLimit.headers
            });
        }

        this.getRouter().post('/login', loginLimiter, passport.authenticate('local', { failWithError: true }),
            // handle success
            async(req, res) => {
                if (req.user.active || req.user.isAdmin) {
                    if (req.user.twoFactorSecret) {
                        req.session.twoFactorRequired = true;
                        return res.json({
                            "success": true,
                            "twoFactor": true
                        });
                    } else {
                        req.session.twoFactorRequired = false;
                        if (req.user.mustChangePassword) {
                            return res.json({
                                "success": true,
                                "mustChangePassword": true
                            });
                        } else {
                            return res.json({
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
                        }
                    }
                } else {
                    this.getLogger().warn('[LoginService::/login] login attempt by suspended user %s', req.user.username);
                    req.logout();
                    req.session.destroy(() => {
                        res.clearCookie(this.sessionName);
                        return errorHandler(res, new Error(JSON.stringify({
                            code: ErrorCodes.ERR_FORBIDDEN,
                            message: 'Forbidden'
                        })));
                    });
                }
            },
            // handle error
            async(error, req, res) => {
                this.getLogger().error('[LoginService::/login] %s', error.message);
                return errorHandler(res, new Error(JSON.stringify({
                    code: ErrorCodes.ERR_FORBIDDEN,
                    message: 'Forbidden'
                })));
            }
        );

        this.getRouter().post('/logout', (req, res) => {
            req.logout();
            req.session.destroy(() => {
                res.clearCookie(this.sessionName);
                return res.json({"success": true});
            });
        });
    }
}

module.exports = LoginService;