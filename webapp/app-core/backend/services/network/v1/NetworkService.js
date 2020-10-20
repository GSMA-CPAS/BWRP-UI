'use strict';

const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const errorHandler = require(global.GLOBAL_BACKEND_ROOT + '/libs/errorhandler');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class NetworkService extends AbstractService {

    constructor(serviceName, serviceConfig, app, database) {
        super(serviceName, serviceConfig, app, database);
        this.requiredAdapterType('blockchain');
        this.registerRequestHandler();
    }

    registerRequestHandler() {

        /**
         * curl -X GET http://{host}:{port}/api/v1/network/discovery/msps
         */
        this.getRouter().get('/discovery/msps', ensureAuthenticated, async (req, res) => {
            try {
                const response = await this.getBackendAdapter('blockchain').discovery();
                return res.json(response);
            } catch (error) {
                return errorHandler(res, new Error(JSON.stringify({
                    code: ErrorCodes.ERR_NETWORK_DISCOVERY,
                    message: 'Failed to discover msps'
                })));
            }
        });

        /**
         * curl -X GET http://{host}:{port}/api/v1/network/discovery/msps/{mps}
         */
        this.getRouter().get('/discovery/msps/:msp', ensureAuthenticated, async (req, res) => {
            const msp = req.params.msp;
            try {
                const response = await this.getBackendAdapter('blockchain').discovery(msp);
                return res.json(response);
            } catch (error) {
                return errorHandler(res, new Error(JSON.stringify({
                    code: ErrorCodes.ERR_NETWORK_DISCOVERY,
                    message: 'Failed to discover msp'
                })));
            }
        });
    }
}

module.exports = NetworkService;

