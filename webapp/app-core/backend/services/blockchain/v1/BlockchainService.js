'use strict';

const config = require('config');
const Enums = require(global.GLOBAL_BACKEND_ROOT + '/Enums');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/cryptoUtils');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class BlockchainService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('blockchain');
    this.requiredAdapterType('localStorage');
    this.requiredAdapterType('wallet');
    this.registerRequestHandler();
    this.mspid = config.organization.mspid;
    this.requiredAdapterType('common');
  }

  /*
   * convert a document(offchain) to a privateDocument(local)
   */
  converToPrivateDocument(document) {
    const documentData = Buffer.from(document.data, 'base64').toString();
    this.getLogger().debug('[BlockchainService::processDocument] documentData %s ', documentData);

    const documentDataJson = JSON.parse(documentData);
    this.getLogger().debug('[BlockchainService::processDocument] documentDataJson %s ', JSON.stringify(documentDataJson));

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
    this.getLogger().debug('[BlockchainService::processDocument] processing documentId %s ', privateDocument.documentId);

    if (await this.getBackendAdapter('localStorage').existsDocument(privateDocument.documentId)) {
      const data = {
        state: Enums.documentState.SENT,
      };
      await this.getBackendAdapter('localStorage').updateDocument(privateDocument.documentId, data);
    } else {
      await this.getBackendAdapter('localStorage').storeDocument(privateDocument.documentId, privateDocument);
      this.getLogger().info('[BlockchainService::privateDocument] Stored document with id %s successfully', privateDocument.documentId);
    }
  }

  registerRequestHandler() {
    /**
     * curl -X GET http://{host}:{port}/api/v1/blockchain/documents
     * curl -X GET http://{host}:{port}/api/v1/blockchain/documents?type=contract
     * curl -X GET http://{host}:{port}/api/v1/blockchain/documents?type=contract&state=sent
     */
    this.getRouter().get('/documents', ensureAuthenticated, async (req, res) => {
      try {
        // const response = await this.getBackendAdapter('localStorage').getDocuments(req.query);
        const response = await this.getBackendAdapter('common').getContracts();
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get private documents',
        })), 'GET /');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/blockchain/documents/{documentId}
     */
    this.getRouter().get('/documents/:documentId', ensureAuthenticated, async (req, res) => {
      const documentId = req.params.documentId;
      try {
        // const response = await this.getBackendAdapter('localStorage').getDocument(documentId);
        const response = await this.getBackendAdapter('common').getContractById(documentId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get document',
        })), 'GET /:documentId');
      }
    });

    /**
     *  curl -X POST http://{host}:{port}/api/v1/blockchain/documents -d '{"toMSP":"TMUS","data":{...}}' -H "Content-Type: application/json"
     */
    this.getRouter().post('/documents', ensureAuthenticated, async (req, res) => {
      try {
        const toMSP = req.body.toMSP;
        const data = req.body.data;
        // const documentDataBase64 = Buffer.from(JSON.stringify(data)).toString('base64');
        // const response = await this.getBackendAdapter('blockchain').uploadPrivateDocument(toMSP, documentDataBase64);
        // const documentId = response.documentID;
        // const documentData = {
        //   'fromMSP': this.mspid,
        //   'toMSP': toMSP,
        //   'data': JSON.stringify(data),
        //   'state': Enums.documentState.PENDING,
        // };
        // await this.getBackendAdapter('localStorage').storeDocument(documentId, documentData);
        const response = await this.getBackendAdapter('common').createContract(toMSP, data);
        return res.json(response);
      } catch (error) {
        this.getLogger().error('[BlockchainService::/] Failed to store document - %s', error.message);
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to store document',
        })), 'POST /');
      }
    });

    /**
     * curl -X POST http://{host}:{port}/api/v1/blockchain/documents/events -d '{...}'
     */
    this.getRouter().post('/documents/events', async (req /* , res*/) => {
      this.getLogger().debug('[BlockchainService::/event] req.body: %s', JSON.stringify(req.body));
      const body = req.body;
      if (body && body.data && body.data.storageKey) {
        const storageKey = body.data.storageKey;
        try {
          // process all documents and delete in transient db after successful storage in local db
          const availableDocumentIDs = await this.getBackendAdapter('blockchain').getPrivateDocumentIDs();
          this.getLogger().debug('[BlockchainService::/events] availableDocumentIDs: %s', JSON.stringify(availableDocumentIDs));
          for (const id in availableDocumentIDs) {
            if (Object.prototype.hasOwnProperty.call(availableDocumentIDs, id)) {
              this.getLogger().debug('[BlockchainService::/events] id: %d , availableDocumentIDs[id]: %s ', id, availableDocumentIDs[id]);
              const document = await this.getBackendAdapter('blockchain').getPrivateDocument(availableDocumentIDs[id]);
              if (document) {
                const privateDocument = this.converToPrivateDocument(document);
                await this.processPrivateDocument(privateDocument);
                const documentIsStored = await this.getBackendAdapter('localStorage').existsDocument(privateDocument.documentId);
                if (documentIsStored) {
                  await this.getBackendAdapter('blockchain').deletePrivateDocument(privateDocument.documentId);
                  this.getLogger().info('[BlockchainService::/events] Deleted document with id %s successfully', privateDocument.documentId);
                }
              }
            }
          }

          const documentId = await this.getBackendAdapter('localStorage').getDocumentIDFromStorageKey(storageKey);
          this.getLogger().debug('[BlockchainService::/events] documentId: %s', documentId);
          const privateDocument = await this.getBackendAdapter('localStorage').getDocument(documentId);

          if (privateDocument) {
            await this.processPrivateDocument(privateDocument);
            this.getLogger().info('[BlockchainService::/events] Stored document with id %s successfully', documentId);
          } else {
            this.getLogger().error('[BlockchainService::/events] Failed to get private document with id - %s', documentId);
          }
        } catch (error) {
          this.getLogger().error('[BlockchainService::/events] Failed to store document - %s', error.message);
        }
      }
    });

    /**
     *  curl -X GET http://{host}:{port}/api/v1/blockchain/signatures/{documentId}/{msp}
     */
    this.getRouter().get('/signatures/:documentId/:msp', ensureAuthenticated, async (req, res) => {
      const documentId = req.params.documentId;
      const msp = req.params.msp;
      try {
        // const response = await this.getBackendAdapter('blockchain').getSignatures(documentId, msp);
        const response = await this.getBackendAdapter('common').getSignatures(documentId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to get signatures',
        })), 'GET /:documentId/:msp');
      }
    });

    /**
     *  curl -X PUT http://{host}:{port}/api/v1/blockchain/signatures/{documentId}
     */
    this.getRouter().put('/signatures/:documentId', ensureAuthenticated, async (req, res) => {
      const documentId = req.params.documentId;
      try {
        const identity = await this.getBackendAdapter('wallet').getIdentity(req.user.enrollmentId);
        const privateKey = identity.credentials.privateKey;
        const certificate = identity.credentials.certificate;
        const document = await this.getBackendAdapter('localStorage').getDocument(documentId);
        const signature = cryptoUtils.createSignature(privateKey, document.data);
        const signatureAlgo = 'ecdsa-with-SHA256_secp256r1';
        await this.getBackendAdapter('blockchain').uploadSignature(documentId, certificate, signatureAlgo, signature);
        return res.json({
          signature: signature,
          algorithm: signatureAlgo,
          certificate: certificate,
        });
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to store signature',
        })), 'PUT /:documentId');
      }
    });

    /**
     * curl -X POST http://{host}:{port}/api/v1/blockchain/signatures/events -d '{...}'
     */
    this.getRouter().post('/signatures/events', async (req, res) => {
      this.getLogger().debug('[BlockchainService] body - %s', JSON.stringify(req.body));
      res.json({status: true});
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/blockchain/discovery/msps
     */
    this.getRouter().get('/discovery/msps', ensureAuthenticated, async (req, res) => {
      try {
        const response = await this.getBackendAdapter('blockchain').discovery();
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_NETWORK_DISCOVERY,
          message: 'Failed to discover msps',
        })), 'GET /discovery/msps');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/blockchain/discovery/msps/{mps}
     */
    this.getRouter().get('/discovery/msps/:msp', ensureAuthenticated, async (req, res) => {
      const msp = req.params.msp;
      try {
        const response = await this.getBackendAdapter('blockchain').discovery(msp);
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

module.exports = BlockchainService;
