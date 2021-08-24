'use strict';

const config = require('config');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const pbkdfUtils = require(global.GLOBAL_BACKEND_ROOT + '/commons/pbkdfUtils');
const rateLimit = require('express-rate-limit');

class LoginService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('users');
    this.sessionName = config.get('session').name;

    passport.use(new Strategy(
        async (username, password, done) => {
          let user;
          try {
            user = await this.getBackendAdapter('users').getUserByName(username, true);
          } catch (error) {
            this.getLogger().error('[LoginService] failed to get user %s - %s', username, error.message);
            return done(error);
          }

          let passwordVerified = false;
          try {
            passwordVerified = await this.getBackendAdapter('users').comparePassword(user, password);
          } catch (error) {
            this.getLogger().error('[LoginService] failed to compare password - %s', error.message);
            return done(error);
          }

          if (passwordVerified) {
            if (!user.active) {
              this.getLogger().warn('[LoginService] login attempt by deactivated user with id %s', user.id);
              return done(null, false);
            }
            if (user.loginAttempts > 0) {
              try {
                await this.getBackendAdapter('users').setLoginAttempts(user, 0);
              } catch (error) {
                this.getLogger().error('[LoginService] failed to set login attempts for user with id %s - %s', user.id, error.message);
              }
            }
            let kek;
            try {
              kek = await pbkdfUtils.createKek(password, user.encKey);
            } catch (error) {
              this.getLogger().error('[LoginService] failed to generate kek - %s', error.message);
              return done(error);
            }
            return done(null, {
              id: user.id,
              username: user.username,
              isAdmin: user.isAdmin,
              active: user.active,
              loginAttempts: user.loginAttempts,
              mustChangePassword: user.mustChangePassword,
              twoFactorSecret: user.twoFactorSecret,
              kek: kek,
            });
          } else {
            this.getLogger().warn('[LoginService] user with id %s has entered wrong password', user.id);
            try {
              await this.getBackendAdapter('users').setLoginAttempts(user, user.loginAttempts + 1);
            } catch (error) {
              this.getLogger().error('[LoginService] failed to set login attempt for user with id %s - %s', user.id, error.message);
              return done(error);
            }
            return done(null, false);
          }
        },
    ));

    passport.serializeUser((user, done) => {
      done(null, {id: user.id, kek: user.kek});
    });

    passport.deserializeUser(async (user, done) => {
      const userId = user.id;
      const kek = user.kek;
      try {
        user = await this.getBackendAdapter('users').getUserById(userId);
      } catch (error) {
        this.getLogger().error('[LoginService::deserializeUser] failed to get user with id %s - %s', userId, error.message);
        return done(null, false);
      }
      // const encKey = user.encKey;
      try {
        // const dek = pbkdfUtils.decryptDek(kek, encKey);
        // user['privateKey'] = pbkdfUtils.decryptData(dek, user.privateKey);
        user['kek'] = kek;
        done(null, user);
      } catch (error) {
        this.getLogger().error('[LoginService::deserializeUser] failed to decrypt key - %s', error.message);
        return done(error);
      }
    });

    this.getApp().use(passport.initialize());
    this.getApp().use(passport.session());
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    let loginLimiter = function(req, res, next) {
      next();
    };

    if (this.getServiceConfig().rateLimit.enabled) {
      loginLimiter = rateLimit({
        message: {
          'success': false,
          'message': 'Too many login requests from this IP, please try again later',
        },
        windowMs: this.getServiceConfig().rateLimit.windowMS,
        max: this.getServiceConfig().rateLimit.maxPerIP,
        headers: this.getServiceConfig().rateLimit.headers,
      });
    }

    this.getRouter().post('/login', loginLimiter, (req, res, next) => {
      passport.authenticate('local', {failWithError: true},
          (error, user/* , info*/) => {
            if (error) {
              return this.handleError(res, new Error(JSON.stringify({
                code: ErrorCodes.ERR_FORBIDDEN,
                message: 'Forbidden'
              })));
            }
            if (!user) {
              return this.handleError(res, new Error(JSON.stringify({
                code: ErrorCodes.ERR_FORBIDDEN,
                message: 'Forbidden'
              })));
            }
            req.login(user, (loginError) => {
              if (loginError) {
                this.getLogger().error('[LoginService::/login] login error - %s', loginError.message);
                return next(loginError);
              }
              this.getLogger().info('[LoginService::/login] user with id %s has been logged in successfully with his password (2fa=%s)', user.id, (user.twoFactorSecret) ? true : false);
              if (user.twoFactorSecret) {
                req.session.twoFactorRequired = true;
                return res.json({
                  'success': true,
                  'twoFactor': true,
                });
              } else {
                req.session.twoFactorRequired = false;
                if (user.mustChangePassword) {
                  return res.json({
                    'success': true,
                    'mustChangePassword': true,
                  });
                } else {
                  return res.json({
                    'success': true,
                    'appContext': {
                      'user': {
                        'username': user.username,
                        'isAdmin': user.isAdmin,
                      },
                      'organization': config.get('organization')
                    },
                  });
                }
              }
            });
          })(req, res, next);
    });

    this.getRouter().post('/logout', (req, res) => {
      req.logout();
      req.session.destroy(() => {
        res.clearCookie(this.sessionName);
        return res.json({'success': true});
      });
    });
  }
}

module.exports = LoginService;
