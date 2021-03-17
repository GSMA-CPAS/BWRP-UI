'use strict';

const config = require('config');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/cryptoUtils');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class CommonService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('user');
    this.requiredAdapterType('wallet');
    this.requiredAdapterType('common');
    this.registerRequestHandler();
    this.mspid = config.organization.mspid;
  }

  registerRequestHandler() {
    /**
     * curl -X GET http://{host}:{port}/api/v1/common/documents
     * // TODO: curl -X GET http://{host}:{port}/api/v1/common/documents?type=contract
     * // TODO: curl -X GET http://{host}:{port}/api/v1/common/documents?type=contract&state=sent
     */
    this.getRouter().get('/documents', ensureAuthenticated, async (req, res) => {
      try {
        const response = await this.getBackendAdapter('common').getContracts(req.query);
        return res.json(response);
      } catch (error) {
        this.handleError(res, error, 'GET /documents');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/common/documents/{contractId}[/?format=RAW]
     */
    this.getRouter().get('/documents/:contractId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const requireRaw = req.query.format === 'RAW';
      try {
        let response = {};
        if (requireRaw) {
          response = await this.getBackendAdapter('common').getRawContractById(contractId);
        } else {
          // currently passing self mspid for some Payload convertion. Require some cleanup
          response = await this.getBackendAdapter('common').getContractById(contractId, this.mspid);
        }
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get document'
        })), 'GET /:contractId');
      }
    });

    /**
     *  curl -X POST http://{host}:{port}/api/v1/common/documents -d '{"toMSP":"TMUS","data":{...}}' -H "Content-Type: application/json"
     */
    this.getRouter().post('/documents', ensureAuthenticated, async (req, res) => {
      try {
        const toMSP = req.body.toMSP;
        const data = req.body.data;
        // TODO: sync payload requirement with common adapter. currently some Pre processing is needed in the Adapter code.
        const response = await this.getBackendAdapter('common').createContract(toMSP, data);
        return res.json(response);
      } catch (error) {
        this.getLogger().error('[CommonService::/] Failed to store document - %s', error.message);
        this.handleError(res, error, 'POST /documents');
      }
    });

    /**
     *  curl -X GET http://{host}:{port}/api/v1/common/signatures/{contractId}
     */
    this.getRouter().get('/signatures/:contractId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      try {
        const response = await this.getBackendAdapter('common').getSignatures(contractId, true);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to get signatures',
        })), 'GET /:contractId');
      }
    });

    /**
     *  curl -X PUT http://{host}:{port}/api/v1/common/signatures/{contractId}
     */
    this.getRouter().put('/signatures/:contractId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const identity = req.body.identity;
      if (!identity) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_MISSING_PARAMETER,
          message: 'Missing parameter: identity',
        })), 'PUT /signatures/:contractId');
      }
      try {
        const userIdentities = await this.getBackendAdapter('user').getUserIdentities(req.user.id);
        const hasIdentity = userIdentities.some((item) => item.name === identity);
        if (hasIdentity) {
          const walletIdentity = await this.getBackendAdapter('wallet').getIdentity(identity);
          if (walletIdentity) {
            const privateKey = walletIdentity.credentials.privateKey;
            const certificate = walletIdentity.credentials.certificate;
            const document = await this.getBackendAdapter('common').getRawContractById(contractId);
            const signature = cryptoUtils.createSignature(privateKey, document.raw);
            const signatureAlgo = 'ecdsa-with-SHA256_secp256r1';
            const response = await this.getBackendAdapter('common').signContract(contractId, certificate, signatureAlgo, signature);
            return res.json(response);
          } else {
            return this.handleError(res, new Error(JSON.stringify({
              code: ErrorCodes.ERR_VALIDATION,
              message: 'Failed to get wallet identity: ' + identity,
            })), 'PUT /signatures/:contractId');
          }
        } else {
          return this.handleError(res, new Error(JSON.stringify({
            code: ErrorCodes.ERR_VALIDATION,
            message: 'Wrong user identity: ' + identity,
          })), 'PUT /signatures/:contractId');
        }
      } catch (error) {
        this.handleError(res, error, 'PUT /signatures/:contractId');
      }
    });

    /**
     *  curl -X GET http://{host}:{port}/api/v1/common/signatures/{contractId}/{signatureId}
     */
    this.getRouter().get('/signatures/:contractId/:signatureId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const signatureId = req.params.signatureId;
      try {
        const response = await this.getBackendAdapter('common').getSignaturesById(contractId, signatureId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to get signature',
        })), 'GET /:contractId/:signatureId');
      }
    });

    /**
     * get list of available usages
     * curl -X GET http://{host}:{port}/api/v1/common/usages/{contractId}
     */
    this.getRouter().get('/usages/:contractId', ensureAuthenticated, async (req, res) => {
      try {
        const contractId = req.params.contractId;
        const response = await this.getBackendAdapter('common').getUsages(contractId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get usages of contracts',
        })), 'GET /usages/:contractId');
      }
    });

    /**
     * get usages ny usageId
     * curl -X GET http://{host}:{port}/api/v1/common/usages/{contractId}/{usageId}
     */
    this.getRouter().get('/usages/:contractId/:usageId', ensureAuthenticated, async (req, res) => {
      try {
        const contractId = req.params.contractId;
        const usageId = req.params.usageId;
        const response = await this.getBackendAdapter('common').getUsagesById(contractId, usageId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get usages of contracts by usageId',
        })), 'GET /usages/:contractId/:usageId');
      }
    });

    /**
     * create a new usage
     *  curl -X POST http://{host}:{port}/api/v1/common/usages/{contractId} -d '{"header":{...},"body":{...}}' -H "Content-Type: application/json"
     */
    this.getRouter().post('/usages/:contractId', ensureAuthenticated, async (req, res) => {
      try {
        const contractId = req.params.contractId;
        const data = req.body;
        const response = await this.getBackendAdapter('common').createUsage(contractId, data);
        return res.json(response);
      } catch (error) {
        this.getLogger().error('[CommonService::/] Failed to store usage - %s', error.message);
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to store usage',
        })), 'POST /usages/:contractId');
      }
    });

    /**
     * update usage by usageId
     *  curl -X PUT http://{host}:{port}/api/v1/common/usages/{contractId}/{usageId}
     */
    this.getRouter().put('/usages/:contractId/:usageId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const usageId = req.params.usageId;
      const data = req.body;
      try {
        const response = await this.getBackendAdapter('common').updateUsage(contractId, usageId, data);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to update usages',
        })), 'PUT /usages/:contractId/:usageId');
      }
    });

    /**
     * delete usage by usageId
     *  curl -X DELETE http://{host}:{port}/api/v1/common/usages/{contractId}/{usageId}
     */
    this.getRouter().delete('/usages/:contractId/:usageId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const usageId = req.params.usageId;
      try {
        const response = await this.getBackendAdapter('common').deleteUsage(contractId, usageId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to delete usages',
        })), 'DELETE /usages/:contractId/:usageId');
      }
    });

    /**
     * Send Usage Report to Partner
     * curl -X PUT http://{host}:{port}/api/v1/common/usages/{contractId}/{usageId}/send/
     */
    this.getRouter().put('/usages/:contractId/:usageId/send/', ensureAuthenticated, async (req, res) => {
      console.log('commonService');
      const contractId = req.params.contractId;
      const usageId = req.params.usageId;
      console.log(contractId);
      console.log(usageId);
      try {
        const response = await this.getBackendAdapter('common').sendUsageById(contractId, usageId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_BAD_REQUEST,
          message: 'Failed to send usage',
        })), 'PUT /usages/:contractId/:usageId/send/');
      }
    });

    /**
     * Generated Settlement from usageId
     * curl -X PUT http://{host}:{port}/api/v1/common/usages/{contractId}/{usageId}/generate/
     */
    this.getRouter().put('/usages/:contractId/:usageId/generate/', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const usageId = req.params.usageId;
      try {
        const response = await this.getBackendAdapter('common').generateSettlementsById(contractId, usageId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to generate settlements',
        })), 'PUT /usages/:contractId/:usageId/generate/');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/common/settlements/{contractId}
     */
    this.getRouter().get('/settlements/:contractId', ensureAuthenticated, async (req, res) => {
      try {
        const contractId = req.params.contractId;
        const response = await this.getBackendAdapter('common').getSettlements(contractId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get settlements of contracts',
        })), 'GET /settlements/:contractId');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/common/settlements/{contractId}/{settlementId}
     */
    this.getRouter().get('/settlements/:contractId/:settlementId', ensureAuthenticated, async (req, res) => {
      try {
        const contractId = req.params.contractId;
        const settlementId = req.params.settlementId;
        const response = await this.getBackendAdapter('common').getSettlementsById(contractId, settlementId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get settlements of contracts by usageId',
        })), 'GET /settlements/:contractId/:settlementId');
      }
    });

    /**
     * Send Generated Settlement to Partner
     * curl -X PUT http://{host}:{port}/api/v1/common/settlements/{contractId}/{settlementId}/send/
     */
    this.getRouter().put('/settlements/:contractId/:settlementId/send/', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const settlementId = req.params.settlementId;
      try {
        const response = await this.getBackendAdapter('common').sendSettlementsById(contractId, settlementId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to send settlements',
        })), 'PUT /settlements/:contractId/:settlementId/send/');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/common/discovery/msps
     */
    this.getRouter().get('/discovery/msps', ensureAuthenticated, async (req, res) => {
      try {
        const response = await this.getBackendAdapter('common').discovery();
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_NETWORK_DISCOVERY,
          message: 'Failed to discover msps',
        })), 'GET /discovery/msps');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/common/discovery/msps/{mps}
     */
    this.getRouter().get('/discovery/msps/:msp', ensureAuthenticated, async (req, res) => {
      const msp = req.params.msp;
      try {
        const response = await this.getBackendAdapter('common').discovery(msp);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_NETWORK_DISCOVERY,
          message: 'Failed to discover msp',
        })), 'GET /discovery/msps/:msp');
      }
    });
  }
}

module.exports = CommonService;
