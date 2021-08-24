'use strict';

const got = require('got');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapters/AbstractAdapter');

class BlockchainAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
  }

  async discovery(msp) {
    try {
      let response;
      if (msp) {
        response = await got(this.adapterConfig.url + '/discovery/msps/' + msp);
      } else {
        response = await got(this.adapterConfig.url + '/discovery/msps');
      }
      return response.body;
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::discovery] failed to discover msp - %s', error.message);
      throw error;
    }
  }

  async getPrivateDocumentIDs() {
    try {
      const ids = await got(this.adapterConfig.url + '/private-documents').
          json();
      this.getLogger().debug('[BlockchainAdapter::getPrivateDocumentIDs] all ids: - %s', JSON.stringify(ids));
      return ids;
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::getPrivateDocumentIDs] failed to get documents - %s', error.message);
      throw error;
    }
  }

  async getPrivateDocument(documentId) {
    try {
      return await got(
          this.adapterConfig.url + '/private-documents/' + documentId).json();
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::getPrivateDocument] failed to get document - %s', error.message);
      throw error;
    }
  }

  async deletePrivateDocument(documentId) {
    try {
      return await got.delete(this.adapterConfig.url + '/private-documents/' + documentId).json();
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::deletePrivateDocument] failed to get document - %s', error.message);
      throw error;
    }
  }

  async uploadPrivateDocument(toMSP, dataBase64) {
    try {
      const response = await got.post(
          this.adapterConfig.url + '/private-documents', {
            json: {
              toMSP: toMSP,
              data: dataBase64
            },
            responseType: 'json'
          });
      return response.body;
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::uploadPrivateDocument] failed to upload document - %s', error.message);
      throw error;
    }
  }

  async getSignatures(documentId, msp) {
    try {
      const response = await got(this.adapterConfig.url + '/signatures/' + documentId + '/' + msp);
      return response.body;
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::getSignatures] failed to get signatures - %s', error.message);
      throw error;
    }
  }

  async uploadSignature(documentId, certificate, algorithm, signature) {
    try {
      const response = await got.put(
          this.adapterConfig.url + '/signatures/' + documentId, {
            json: {
              certificate: certificate,
              algorithm: algorithm,
              signature: signature
            },
            responseType: 'json'
          });
      return response.body;
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::uploadSignature] failed to upload signature - %s', error.message);
      throw error;
    }
  }

  async webhookSubscribe(eventName, callbackUrl) {
    try {
      const response = await got.post(
          this.adapterConfig.url + '/webhooks/subscribe', {
            json: {
              'eventName': eventName,
              'callbackUrl': callbackUrl
            },
            responseType: 'text'
          });
      return response.body;
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::webhookSubscribe] failed to subscribe - %s', error.message);
      throw error;
    }
  }

  async onSetup() {
    try {
      const webhooks = this.getAdapterConfig().webhooks;
      for (const webhook of webhooks) {
        await this.webhookSubscribe(webhook.eventName, webhook.callbackUrl);
        this.getLogger().info('[BlockchainAdapter::onSetup] webhook subscribe: %s -> %s', webhook.eventName, webhook.callbackUrl);
      }
    } catch (error) {
      this.getLogger().error('[BlockchainAdapter::onSetup] failed to initialize adapter - %s', error.message);
      throw error;
    }
  }
}

module.exports = BlockchainAdapter;
