'use strict';

const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/cryptoUtils');

class SignatureService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.requiredAdapterType('blockchain');
    this.requiredAdapterType('localStorage');
    this.requiredAdapterType('wallet');
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    /**
     *  curl -X GET http://{host}:{port}/api/v1/signatures/{documentId}/{msp}
     */
    this.getRouter().get('/:documentId/:msp', ensureAuthenticated, async (req, res) => {
      const documentId = req.params.documentId;
      const msp = req.params.msp;
      try {
        const response = await this.getBackendAdapter('blockchain').getSignatures(documentId, msp);
        return res.json(response);
      } catch (error) {
        this.handleError(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_SIGNATURE,
          message: 'Failed to get signatures',
        })), 'GET /:documentId/:msp');
      }
    });

    /**
     *  curl -X PUT http://{host}:{port}/api/v1/signatures/{documentId}
     */
    this.getRouter().put('/:documentId', ensureAuthenticated, async (req, res) => {
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
     * curl -X POST http://{host}:{port}/api/v1/signatures/event -d '{...}'
     */
    this.getRouter().post('/event', async (req, res) => {
      this.getLogger().debug('[SignatureService] body - %s', JSON.stringify(req.body));
      res.json({status: true});
    });
  }
}

module.exports = SignatureService;
