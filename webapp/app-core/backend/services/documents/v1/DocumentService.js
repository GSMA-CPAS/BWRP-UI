'use strict';

const config = require('config');
const Enums = require(global.GLOBAL_BACKEND_ROOT + '/Enums');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;

class DocumentService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('blockchain');
    this.requiredAdapterType('localStorage');
    this.registerRequestHandler();
    this.mspid = config.organization.mspid;
  }

  /*
   * convert a document(offchain) to a privateDocument(local)
   */
  converToPrivateDocument(document) {
    const documentData = Buffer.from(document.data, 'base64').toString();
    this.getLogger().debug('[DocumentService::processDocument] documentData %s ', documentData);

    const documentDataJson = JSON.parse(documentData);
    this.getLogger().debug('[DocumentService::processDocument] documentDataJson %s ', JSON.stringify(documentDataJson));

    const privateDocument = {
      'documentId': document.id,
      'type': documentDataJson.header.type,
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
    this.getLogger().debug('[DocumentService::processDocument] processing documentId %s ', privateDocument.documentId);

    if (await this.getBackendAdapter('localStorage').existsDocument(privateDocument.documentId)) {
      const data = {
        state: Enums.documentState.SENT,
      };
      await this.getBackendAdapter('localStorage').updateDocument(privateDocument.documentId, data);
    } else {
      await this.getBackendAdapter('localStorage').storeDocument(privateDocument.documentId, privateDocument);
      this.getLogger().info('[DocumentService::privateDocument] Stored document with id %s successfully', privateDocument.documentId);
    }
  }

  registerRequestHandler() {
    /**
     * curl -X GET http://{host}:{port}/api/v1/documents
     * curl -X GET http://{host}:{port}/api/v1/documents?type=contract
     * curl -X GET http://{host}:{port}/api/v1/documents?type=contract&state=sent
     */
    this.getRouter().get('/', ensureAuthenticated, async (req, res) => {
      const type = req.query.type;
      const state = req.query.state;
      try {
        const response = await this.getBackendAdapter('localStorage').getDocuments(type, state);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to get private documents',
        })), 'GET /');
      }
    });

    /**
     * curl -X GET http://{host}:{port}/api/v1/documents/{documentId}
     */
    this.getRouter().
        get('/:documentId', ensureAuthenticated, async (req, res) => {
          const documentId = req.params.documentId;
          try {
            const response = await this.getBackendAdapter('localStorage').getDocument(documentId);
            return res.json(response);
          } catch (error) {
            this.handleError(res, new Error(JSON.stringify({
              code: ErrorCodes.ERR_PRIVATE_DATA,
              message: 'Failed to get document',
            })), 'GET /:documentId');
          }
        }
        );

    /**
     *  curl -X POST http://{host}:{port}/api/v1/documents -d '{"type":"contract", "toMSP":"TMUS","data":{...}}' -H "Content-Type: application/json"
     */
    this.getRouter().post('/', ensureAuthenticated, async (req, res) => {
      try {
        const type = req.body.type;
        const toMSP = req.body.toMSP;
        const data = req.body.data;
        const dataJson = {
          header: {version: '1.0', type: type, msps: {}},
          body: data,
        };
        dataJson.header.msps[this.mspid] = {minSignatures: 2};
        dataJson.header.msps[toMSP] = {minSignatures: 2};

        const documentDataBase64 = Buffer.from(JSON.stringify(dataJson)).toString('base64');
        const response = await this.getBackendAdapter('blockchain').uploadPrivateDocument(toMSP, documentDataBase64);
        const documentId = response.documentID;
        const documentData = {
          'type': type,
          'fromMSP': this.mspid,
          'toMSP': toMSP,
          'data': JSON.stringify(dataJson),
          'state': Enums.documentState.PENDING,
        };
        await this.getBackendAdapter('localStorage').storeDocument(documentId, documentData);
        return res.json(response);
      } catch (error) {
        this.getLogger().error('[DocumentService::/] Failed to store document - %s', error.message);
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_PRIVATE_DATA,
          message: 'Failed to store document',
        })), 'POST /');
      }
    });

    /**
     * curl -X POST http://{host}:{port}/api/v1/documents/event -d '{...}'
     */
    this.getRouter().post('/event', async (req /* , res*/) => {
      this.getLogger().debug('[DocumentService::/event] req.body: %s', JSON.stringify(req.body));
      const body = req.body;
      if (body && body.data && body.data.storageKey) {
        const storageKey = body.data.storageKey;
        try {
          // process all documents and delete in transient db after successful storage in local db
          const availableDocumendIDs = await this.getBackendAdapter('blockchain').getPrivateDocumentIDs();
          this.getLogger().debug('[DocumentService::/event] availableDocumendIDs: %s', JSON.stringify(availableDocumendIDs));
          for (const i in availableDocumendIDs) {
            this.getLogger().debug('[DocumentService::/event] i: %d , availableDocumendIDs[i]: %s ', i, availableDocumendIDs[i]);
            const document = await this.getBackendAdapter('blockchain').getPrivateDocument(availableDocumendIDs[i]);
            if (document) {
              const privateDocument = this.converToPrivateDocument(document);
              await this.processPrivateDocument(privateDocument);
              const documentIsStored = await this.getBackendAdapter('localStorage').existsDocument(privateDocument.documentId);
              if (documentIsStored) {
                await this.getBackendAdapter('blockchain').deletePrivateDocument(privateDocument.documentId);
                this.getLogger().info('[DocumentService::/event] Deleted document with id %s successfully', privateDocument.documentId);
              }
            }
          }

          const documentId = await this.getBackendAdapter('localStorage').getDocumentIDFromStorageKey(storageKey);
          this.getLogger().debug('[DocumentService::/event] documentId: %s', documentId);
          const privateDocument = await this.getBackendAdapter('localStorage').getDocument(documentId);

          if (privateDocument) {
            await this.processPrivateDocument(privateDocument);
            this.getLogger().info('[DocumentService::/event] Stored document with id %s successfully', documentId);
          } else {
            this.getLogger().error('[DocumentService::/event] Failed to get private document with id - %s', documentId);
          }
        } catch (error) {
          this.getLogger().error('[DocumentService::/event] Failed to store document - %s', error.message);
        }
      }
    });
  }
}

module.exports = DocumentService;
