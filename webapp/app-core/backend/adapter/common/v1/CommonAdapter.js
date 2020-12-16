'use strict';

const got = require('got');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');
const crypto = require('crypto');

class CommonAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
  }

  // TODO: support for query parameter to search for contracts.
  async getContracts(query) {
    try {
      const lists = await got(this.adapterConfig.url + '/api/v1/contracts/').json();
      this.getLogger().debug('[CommonAdapter::getContracts] get all contracts: - %s', JSON.stringify(lists));
      const processed = [];
      for (const item of lists) {
        if (item.documentId != undefined) {
          processed.push({contractId: item.contractId, documentId: item.documentId, fromMSP: item.header.fromMsp.mspId, toMSP: item.header.toMsp.mspId, state: item.state, lastModification: item.lastModificationDate, ts: item.lastModificationDate, type: item.header.type, name: item.header.name, version: item.header.version});
        }
      }
      return processed;
    } catch (error) {
      this.getLogger().error('[CommonAdapter::getContracts] failed to get contracts - %s', error.message);
      throw error;
    }
  }

  async getContractById(contractId) {
    try {
      const item = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId).json();
      this.getLogger().debug('[CommonAdapter::getContractById] get contract: - %s', JSON.stringify(item));
      const fromSk = crypto.createHash('sha256').update(item.header.fromMsp.mspId + item.documentId).digest('hex').toString('utf8');
      const toSK = crypto.createHash('sha256').update(item.header.toMsp.mspId + item.documentId).digest('hex').toString('utf8');

      // convert header
      const header = { name: item.header.name, type: 'deal', version: item.header.version, msps: {}};
      header.msps[item.header.fromMsp.mspId] = {minSignatures: item.header.fromMsp.signatures.length};
      header.msps[item.header.toMsp.mspId] = {minSignatures: item.header.toMsp.signatures.length};

      return {id: item.contractId, documentId: item.documentId, fromMSP: item.header.fromMsp.mspId, toMSP: item.header.toMsp.mspId, data: JSON.stringify({body: item.body, header: header}), state: 'sent', ts: item.lastModificationDate, fromStorageKey: fromSk, toStorageKey: toSK};
    } catch (error) {
      this.getLogger().error('[CommonAdapter::getContractById] failed to get contract - %s', error.message);
      throw error;
    }
  }

  async getRawContractById(contractId) {
    try {
      const item = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/?format=RAW').json();
      item.data = item.raw;
      this.getLogger().debug('[CommonAdapter::getContractById] get contract in RAW: - %s', JSON.stringify(item));
      return item;
    } catch (error) {
      this.getLogger().error('[CommonAdapter::getContracts] failed to get contracts - %s', error.message);
      throw error;
    }
  }

  async createContract(toMsp, data) {
    try {
      const header = {name: data.body.generalInformation.name, type: 'contract', version: data.header.version};
      for (const msp in data.header.msps) {
        if (msp == toMsp) {
          header.toMsp = {mspId: msp, signatures: data.body[msp].signatures}
        } else {
          header.fromMsp = {mspId: msp, signatures: data.body[msp].signatures}
        }
      }

      const payload = {header: header, body: data.body};
      const contract = await got.post(
          this.adapterConfig.url + '/api/v1/contracts/', {
            json: payload,
            responseType: 'json'
          });

      const response = await got.put(this.adapterConfig.url + '/api/v1/contracts/' + contract.body.contractId + '/send/',{responseType: 'json'});
      this.getLogger().debug('[CommonAdapter::createContract] create new contract: - %s', JSON.stringify(response.body));
      return response.body;

    } catch (error) {
      this.getLogger().error('[CommonAdapter::createContract] failed to create contract - %s', error.message);
      throw error;
    }
  }

  async getSignatures(contractId) {
    try {
      const lists = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/signatures/').json();
      this.getLogger().debug('[CommonAdapter::getSignatures] get all signatures of contracts: - %s', JSON.stringify(lists));
      const processed = [];
      for (const item of lists) {
        if (item.state == 'SIGNED') {
          const result = await got(this.adapterConfig.url + '/api/v1/contracts/' + item.contractId + '/signatures/' + item.signatureId).json();
          processed.push(result);
        }
      }
      return processed;
    } catch (error) {
      this.getLogger().error('[CommonAdapter::getSignatures] failed to get all signatures - %s', error.message);
      throw error;
    }
  }

  // need support for "signatureId"
  async signContract(contractId, signatureId, selfMsp, certificate, signatureAlgo, signature) {
    try {
      const lists = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/signatures/').json();
      this.getLogger().debug('[CommonAdapter::signContract] get all signatures of contracts: - %s', JSON.stringify(lists));
      for (const item of lists) {
        if (item.msp == selfMsp && item.state == 'UNSIGNED') {
          const payload = {
            certificate: certificate,
            algorithm: signatureAlgo,
            signature: signature
          };
          this.getLogger().debug('[CommonAdapter::signContract] sigining contracts: - %s', JSON.stringify(payload));
          return await got.put(this.adapterConfig.url + '/api/v1/contracts/' + item.contractId + '/signatures/' + item.signatureId, {json: payload, responseType: 'json'});
        }
      }
      // new error code is required
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_FORBIDDEN,
        message: 'Contract has already been signed',
      }));

    } catch (error) {
      this.getLogger().error('[CommonAdapter::signContract] failed to sign contracts - %s', error.message);
      throw error;
    }
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

  async initialize() {
  }
}

module.exports = CommonAdapter;
