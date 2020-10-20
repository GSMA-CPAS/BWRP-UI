'use strict';

const config = require('config');
const logger = require(global.GLOBAL_BACKEND_ROOT + '/libs/logger')(config);

const handleUnauthorized = (req, res) => {
    if (req.accepts(['html', 'json']) !== 'html') {
        return res.status(401).json({status: 401, message: "Unauthorized", redirectUrl: "/login?show=unauthorized"});
    } else {
        return res.redirect('/login?show=unauthorized');
    }
};

const handleMustChangePassword = (req, res) => {
    if (req.accepts(['html', 'json']) !== 'html') {
        return res.status(401).json({status: 401, message: "Unauthorized - must change password", redirectUrl: "/password/change"});
    } else {
        return res.redirect('/password/change');
    }
};

const ensureAuthenticatedWithPassword = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return handleUnauthorized(req, res);
    } else {
        next();
    }
};

const ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return handleUnauthorized(req, res);
    } else {
        if (req.user.mustChangePassword) {
            return handleMustChangePassword(req, res);
        } else {
            if (req.session.twoFactorRequired) {
                return handleUnauthorized(req, res);
            } else {
                next();
            }
        }
    }
};

const ensureAdminAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return handleUnauthorized(req, res);
    } else {
        if (req.user && req.user.isAdmin) {
            if (req.session.twoFactorRequired) {
                return handleUnauthorized(req, res);
            } else {
                next();
            }
        } else {
            logger.warn('Unauthorized admin access attempt');
            return res.status(403).json({status: 403, message: "Forbidden"});
        }
    }
};

module.exports.ensureAuthenticatedWithPassword = ensureAuthenticatedWithPassword;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.ensureAdminAuthenticated = ensureAdminAuthenticated;