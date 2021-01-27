'use strict';

const config = require('config');
const Enums = require(global.GLOBAL_BACKEND_ROOT + '/Enums');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/cryptoUtils');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class CommonService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('common');
    this.requiredAdapterType('wallet');
    this.registerRequestHandler();
    this.mspid = config.organization.mspid;
  }

  /*
   * convert a document(offchain) to a privateDocument(local)
   */
  converToPrivateDocument(document) {
    const documentData = Buffer.from(document.data, 'base64').toString();
    this.getLogger().debug('[CommonService::processDocument] documentData %s ', documentData);

    const documentDataJson = JSON.parse(documentData);
    this.getLogger().debug('[CommonService::processDocument] documentDataJson %s ', JSON.stringify(documentDataJson));

    const privateDocument = {
      'documentId': document.id,
      'fromMSP': document.fromMSP,
      'toMSP': document.toMSP,
      'data': documentData,
      'state': Enums.documentState.SENT,
    };

    return privateDocument;
  }

  /*
   * process a private document and store/update it
   */
  async processPrivateDocument(privateDocument) {
    this.getLogger().debug('[CommonService::processDocument] processing documentId %s ', privateDocument.documentId);

    if (await this.getBackendAdapter('localStorage').existsDocument(privateDocument.documentId)) {
      const data = {
        state: Enums.documentState.SENT,
      };
      await this.getBackendAdapter('localStorage').updateDocument(privateDocument.documentId, data);
    } else {
      await this.getBackendAdapter('localStorage').storeDocument(privateDocument.documentId, privateDocument);
      this.getLogger().info('[CommonService::privateDocument] Stored document with id %s successfully', privateDocument.documentId);
    }
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
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get private documents',
        })), 'GET /');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/common/documents/{contractId}
     */
    this.getRouter().get('/documents/:contractId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      try {
        const response = await this.getBackendAdapter('common').getContractById(contractId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get document',
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
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to store document',
        })), 'POST /');
      }
    });

    /**
     *  curl -X GET http://{host}:{port}/api/v1/common/signatures/{contractId}
     */
    this.getRouter().get('/signatures/:contractId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      try {
        const response = await this.getBackendAdapter('common').getSignatures(contractId);
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
      try {
        const identity = await this.getBackendAdapter('wallet').getIdentity(req.user.enrollmentId);
        const privateKey = identity.credentials.privateKey;
        const certificate = identity.credentials.certificate;
        const document = await this.getBackendAdapter('common').getRawContractById(contractId);
        const signature = cryptoUtils.createSignature(privateKey, document.data);
        const signatureAlgo = 'ecdsa-with-SHA256_secp256r1';
        await this.getBackendAdapter('common').signContract(contractId, '', this.mspid, certificate, signatureAlgo, signature);
        return res.json({
          signature: signature,
          algorithm: signatureAlgo,
          certificate: certificate,
        });
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to store signature',
        })), 'PUT /:contractId');
      }
    });

    /**
     *  curl -X PUT http://{host}:{port}/api/v1/common/signatures/{contractId}/{signatureId}
     */
    this.getRouter().put('/signatures/:contractId/:signatureId', ensureAuthenticated, async (req, res) => {
      const contractId = req.params.contractId;
      const signatureId = req.params.signatureId;
      try {
        const identity = await this.getBackendAdapter('wallet').getIdentity(req.user.enrollmentId);
        const privateKey = identity.credentials.privateKey;
        const certificate = identity.credentials.certificate;
        const document = await this.getBackendAdapter('common').getRawContractById(contractId);
        const signature = cryptoUtils.createSignature(privateKey, document.data);
        const signatureAlgo = 'ecdsa-with-SHA256_secp256r1';
        await this.getBackendAdapter('common').signContract(contractId, signatureId, this.mspid, certificate, signatureAlgo, signature);
        return res.json({
          signature: signature,
          algorithm: signatureAlgo,
          certificate: certificate,
        });
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to store signature',
        })), 'PUT /:contractId/:signatureId');
      }
    });

    /**
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
        })), 'GET /');
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
        })), 'GET /');
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
