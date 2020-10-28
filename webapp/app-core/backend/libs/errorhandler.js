'use strict';

const config = require('config');
const logger = require(global.GLOBAL_BACKEND_ROOT + '/libs/logger')(config);
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

const errorHandler = (res, error, errorMessagePrefix = '') => {

    let status = 500;
    let code = 'ERR_INTERNAL_SERVER_ERROR';
    let message = 'Internal Server Error';

    try {
        let messageObject = JSON.parse(error.message);
        if (messageObject.code && messageObject.message) {
            code = messageObject.code;
            message = messageObject.message;
            switch (messageObject.code) {
                case ErrorCodes.ERR_BAD_REQUEST:
                    status = 400;
                    break;
                case ErrorCodes.ERR_FORBIDDEN:
                    status = 403;
                    break;
                case ErrorCodes.ERR_NOT_FOUND:
                    status = 404;
                    break;
                case ErrorCodes.ERR_DUPLICATE_ENTRY:
                    status = 409;
                    break;
                case ErrorCodes.ERR_MISSING_PARAMETER:
                    status = 422;
                    break;
                case ErrorCodes.ERR_VALIDATION:
                    status = 422;
                    break;
                case ErrorCodes.ERR_PRIVATE_DATA:
                    status = 500;
                    break;
                case ErrorCodes.ERR_CA_USER_ENROLLMENT:
                    status = 500;
                    break;
                case ErrorCodes.ERR_CA_USER_REGISTRATION:
                    status = 500;
                    break;
                default:
                    code = ErrorCodes.ERR_INTERNAL_SERVER_ERROR;
                    message = 'Internal Server Error';
            }
        }
    } catch (ignore) {
        /*if (error.message) {
            if (error.message.includes('identity expired')) {
                status = 400;
                message = 'Identity expired';
            }
        }*/
    }

    logger.error('[' + errorMessagePrefix + '] ' + error.message);
    res.status(status).json({status: status, code: code, message: message});

};

module.exports = errorHandler;