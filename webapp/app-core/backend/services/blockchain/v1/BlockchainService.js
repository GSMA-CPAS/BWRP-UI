'use strict';

const config = require('config');
const Enums = require(global.GLOBAL_BACKEND_ROOT + '/Enums');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/middlewares/auth').ensureAuthenticated;

class BlockchainService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('blockchain');
    this.requiredAdapterType('localStorage');
    this.requiredAdapterType('users');
    this.requiredAdapterType('certAuth');
    this.registerRequestHandler();
    this.mspid = config.organization.mspid;
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
      'referenceId': document.id,
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
    this.getLogger().debug('[BlockchainService::processDocument] processing referenceId %s ', privateDocument.referenceId);

    if (await this.getBackendAdapter('localStorage').existsDocument(privateDocument.referenceId)) {
      const data = {
        state: Enums.documentState.SENT,
      };
      await this.getBackendAdapter('localStorage').updateDocument(privateDocument.referenceId, data);
    } else {
      await this.getBackendAdapter('localStorage').storeDocument(privateDocument.referenceId, privateDocument);
      this.getLogger().info('[BlockchainService::privateDocument] Stored document with id %s successfully', privateDocument.referenceId);
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
        const response = await this.getBackendAdapter('localStorage').getDocuments(req.query);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get private documents'
        })));
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/blockchain/documents/{referenceId}
     */
    this.getRouter().get('/documents/:referenceId', ensureAuthenticated, async (req, res) => {
      const referenceId = req.params.referenceId;
      try {
        const response = await this.getBackendAdapter('localStorage').getDocument(referenceId);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get document'
        })));
      }
    });

    /**
     *  curl -X POST http://{host}:{port}/api/v1/blockchain/documents -d '{"toMSP":"TMUS","data":{...}}' -H "Content-Type: application/json"
     */
    this.getRouter().post('/documents', ensureAuthenticated, async (req, res) => {
      try {
        const toMSP = req.body.toMSP;
        const data = req.body.data;
        const documentDataBase64 = Buffer.from(JSON.stringify(data)).toString('base64');
        const response = await this.getBackendAdapter('blockchain').uploadPrivateDocument(toMSP, documentDataBase64);
        const referenceId = response.referenceID;
        const documentData = {
          'fromMSP': this.mspid,
          'toMSP': toMSP,
          'data': JSON.stringify(data),
          'state': Enums.documentState.PENDING,
        };
        await this.getBackendAdapter('localStorage').storeDocument(referenceId, documentData);
        return res.json(response);
      } catch (error) {
        this.getLogger().error('[BlockchainService::/] Failed to store document - %s', error.message);
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to store document'
        })));
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
                const documentIsStored = await this.getBackendAdapter('localStorage').existsDocument(privateDocument.referenceId);
                if (documentIsStored) {
                  await this.getBackendAdapter('blockchain').deletePrivateDocument(privateDocument.referenceId);
                  this.getLogger().info('[BlockchainService::/events] Deleted document with id %s successfully', privateDocument.referenceId);
                }
              }
            }
          }

          const referenceId = await this.getBackendAdapter('localStorage').getDocumentIDFromStorageKey(storageKey);
          this.getLogger().debug('[BlockchainService::/events] referenceId: %s', referenceId);
          const privateDocument = await this.getBackendAdapter('localStorage').getDocument(referenceId);

          if (privateDocument) {
            await this.processPrivateDocument(privateDocument);
            this.getLogger().info('[BlockchainService::/events] Stored document with id %s successfully', referenceId);
          } else {
            this.getLogger().error('[BlockchainService::/events] Failed to get private document with id - %s', referenceId);
          }
        } catch (error) {
          this.getLogger().error('[BlockchainService::/events] Failed to store document - %s', error.message);
        }
      }
    });

    /**
     *  curl -X GET http://{host}:{port}/api/v1/blockchain/signatures/{referenceId}/{msp}
     */
    this.getRouter().get('/signatures/:referenceId/:msp', ensureAuthenticated, async (req, res) => {
      const referenceId = req.params.referenceId;
      const msp = req.params.msp;
      try {
        const response = await this.getBackendAdapter('blockchain').getSignatures(referenceId, msp);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to get signatures'
        })));
      }
    });

    /**
     *  curl -X PUT http://{host}:{port}/api/v1/blockchain/signatures/{referenceId}
     */
    this.getRouter().put('/signatures/:referenceId', ensureAuthenticated, async (req, res) => {
      const referenceId = req.params.referenceId;
      const identity = req.body.identity;
      if (!identity) {
        return this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_MISSING_PARAMETER,
          message: 'Missing parameter: identity'
        })));
      }
      try {
        const userIdentities = await this.getBackendAdapter('users').getUserIdentities(req.user.id);
        const hasIdentity = userIdentities.some((item) => item.name === identity);
        if (hasIdentity) {
          const walletIdentity = await this.getBackendAdapter('certAuth').getWalletIdentity(identity);
          if (walletIdentity) {
            const certificate = walletIdentity.credentials.certificate;
            const document = await this.getBackendAdapter('localStorage').getDocument(referenceId);
            const signature = await this.getBackendAdapter('certAuth').createSignature(walletIdentity, referenceId, document.data);
            const signatureAlgo = 'ecdsaWithSha256';
            await this.getBackendAdapter('blockchain').uploadSignature(referenceId, certificate, signatureAlgo, signature);
            return res.json({
              signature: signature,
              algorithm: signatureAlgo,
              certificate: certificate,
            });
          } else {
            return this.handleError(res, new Error(JSON.stringify({
              code: ErrorCodes.ERR_VALIDATION,
              message: 'Failed to get wallet identity: ' + identity
            })));
          }
        } else {
          return this.handleError(res, new Error(JSON.stringify({
            code: ErrorCodes.ERR_VALIDATION,
            message: 'Wrong user identity: ' + identity
          })));
        }
      } catch (error) {
        this.handleError(res, error);
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
          message: 'Failed to discover msps'
        })));
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
          message: 'Failed to discover msp'
        })));
      }
    });
  }
}

module.exports = BlockchainService;
