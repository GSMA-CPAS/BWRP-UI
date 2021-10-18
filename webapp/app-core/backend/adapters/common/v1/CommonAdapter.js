'use strict';

const got = require('got');
const config = require('config');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapters/AbstractAdapter');
const cryptoUtils = require(global.GLOBAL_BACKEND_ROOT + '/commons/cryptoUtils');
// const crypto = require('crypto');

class CommonAdapter extends AbstractAdapter {
   constructor(adapterName, adapterConfig, database) {
      super(adapterName, adapterConfig, database);
      this.mspid = config.organization.mspid;
   }

   getPartnerMsp(msps) {
      for (const [key] of Object.entries(msps)) {
         if (key !== this.mspid) {
            return key;
         }
      }
      return 'Unknown';
   }

   getTadigCodes(body) {
      const tadigCodes = [];
      for (const [key] of Object.entries(body.framework.partyInformation)) {
         const defaultTadigCodes = body.framework.partyInformation[key].defaultTadigCodes;
         if (defaultTadigCodes) {
            for (const code of defaultTadigCodes) {
               if (!tadigCodes.includes(code)) {
                  tadigCodes.push(code);
               }
            }
         }
      }
      return tadigCodes;
   }

   // TODO: support for query parameter to search for contracts.
   async getContracts(query) {
      try {
         const lists = await got(this.adapterConfig.url + '/api/v1/contracts/').json();
         this.getLogger().debug('[CommonAdapter::getContracts] get all contracts: - %s', JSON.stringify(lists));
         const processed = [];
         for (const item of lists) {
            if (item.referenceId !== undefined) {
               processed.push({
                  contractId: item.contractId,
                  referenceId: item.referenceId,
                  partnerMsp: this.getPartnerMsp(item.header.msps),
                  state: item.state,
                  lastModification: item.lastModificationDate,
                  startDate: item.body.framework.term && item.body.framework.term.start,
                  endDate: item.body.framework.term && item.body.framework.term.end,
                  authors: item.body.metadata.authors,
                  type: item.header.type,
                  name: item.body.metadata.name,
                  tadigCodes: this.getTadigCodes(item.body),
                  version: item.header.version,
                  isSigned: item.isSigned,
                  isUsageApproved: (item.isUsageApproved) ? item.isUsageApproved : false
               });
            }
         }
         return processed;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getContracts] failed to get contracts - %s', error.message);
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_PRIVATE_DATA,
            message: 'Failed to get contracts',
         }));
      }
   }

   async getContractById(contractId) {
      try {
         const item = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId).json();
         this.getLogger().debug('[CommonAdapter::getContractById] get contract: - %s', JSON.stringify(item));

         // to be removed if not required.
         /* let fromSk = '';
         let toSk = '';
         for (const msp in item.header.msps) {
            if (msp === this.mspid) {
               fromSk = crypto
                  .createHash('sha256')
                  .update(msp + item.referenceId)
                  .digest('hex')
                  .toString('utf8');
            } else {
               toSk = crypto
                  .createHash('sha256')
                  .update(msp + item.referenceId)
                  .digest('hex')
                  .toString('utf8');
            }
         }*/

         // convert header
         const header = {
            name: item.header.name,
            type: 'contract',
            version: item.header.version,
            msps: item.header.msps,
         };

         return {
            contractId: item.contractId,
            blockchainRef: item.blockchainRef,
            referenceId: item.referenceId,
            partnerMsp: this.getPartnerMsp(item.header.msps),
            data: JSON.stringify({body: item.body, header: header}),
            state: 'sent',
            creationDate: item.creationDate,
            lastModificationDate: item.lastModificationDate
         };
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getContractById] failed to get contract - %s', error.message);
         throw error;
      }
   }

   async getRawContractById(contractId) {
      try {
         const item = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/?format=RAW').json();
         this.getLogger().debug('[CommonAdapter::getContractById] get contract in RAW: - %s', JSON.stringify(item));
         return item;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getContracts] failed to get contracts - %s', error.message);
         throw error;
      }
   }

   async createContract(toMsp, data) {
      try {
         const header = {
            name: data.body.metadata.name,
            type: 'contract',
            version: data.header.version,
            msps: data.header.msps,
         };
         const payload = {header: header, body: data.body};
         const contract = await got.post(
            this.adapterConfig.url + '/api/v1/contracts/',
            {
               json: payload,
               responseType: 'json',
            }
         );
         const response = await got.put(
            this.adapterConfig.url + '/api/v1/contracts/' + contract.body.contractId + '/send/',
            {
               responseType: 'json'
            }
         );
         this.getLogger().debug('[CommonAdapter::createContract] create new contract: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::createContract] failed to create contract - %s', error.message);
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_PRIVATE_DATA,
            message: 'Failed to store and send contract',
         }));
      }
   }

   async getSignatures(contractId, addIdentities = false) {
      try {
         const lists = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/signatures/').json();
         this.getLogger().debug('[CommonAdapter::getSignatures] get all signatures of contracts: - %s', JSON.stringify(lists));
         const processed = [];
         for (const item of lists) {
            if (item.state === 'SIGNED') {
               // const result = await got(this.adapterConfig.url + '/api/v1/contracts/' + item.contractId + '/signatures/' + item.signatureId).json();
               const result = await this.getSignaturesById(item.contractId, item.signatureId, addIdentities);
               processed.push(result);
            }
         }
         return processed;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getSignatures] failed to get all signatures - %s', error.message);
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_SIGNATURE,
            message: 'Failed to get all signatures',
         }));
      }
   }

   async getSignaturesById(contractId, signatureId, addIdentity = false) {
      try {
         const signature = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/signatures/' + signatureId).json();
         if (addIdentity) {
            if (signature.certificate) {
               const x509 = cryptoUtils.parseCert(signature.certificate);
               const identity = x509.subject.str;
               signature['identity'] = (identity) ? identity : 'Unknown';
            }
         }
         return signature;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getSignatures] failed to get all signatures - %s', error.message);
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_SIGNATURE,
            message: 'Failed to get signature',
         }));
      }
   }

   async signContract(contractId, certificate, signatureAlgo, signature) {
      try {
         const payload = {
            certificate: certificate,
            algorithm: signatureAlgo,
            signature: signature,
         };
         this.getLogger().debug('[CommonAdapter::signContract] signing contracts: - %s', JSON.stringify(payload));
         const response = await got.post(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/signatures/',
            {
               json: payload,
               responseType: 'json'
            }
         );
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::signContract] failed to sign contract - %s', error.message);
         let errorMessage = 'Failed to sign contract';
         // TODO common adapter -> not clear if already signed or other error
         if (error.response && error.response.statusCode === 422) {
            errorMessage = 'Already signed or missing parameter';
         }
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_SIGNATURE,
            message: errorMessage,
         }));
      }
   }

   async getUsages(contractId, isReceived) {
      try {
         const params = isReceived? '?states=RECEIVED' : '?states=SENT|DRAFT';
         const url = this.adapterConfig.url +
             '/api/v1/contracts/' +
             contractId +
             '/usages/'+ params;
         const lists = await got(url).json();
         this.getLogger().debug(
            '[CommonAdapter::getUsages] get all Usages of contractId-' +
               contractId +
               ': - %s',
            JSON.stringify(lists),
         );
         return lists;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getUsages] failed to getUsages of contractId:' + contractId + ' - %s', error.message);
         throw error;
      }
   }

   async getUsagesById(contractId, usageId) {
      try {
         const item = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId).json();
         this.getLogger().debug('[CommonAdapter::getUsagesById] get usages by Id: - %s', JSON.stringify(item));
         return item;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getUsagesById] failed to get usages by Id - %s', error.message);
         throw error;
      }
   }

   async getRawUsageById(contractId, usageId) {
      try {
         const result = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId + '/?format=RAW').json();
         this.getLogger().debug('[CommonAdapter::getRawUsageById] get usage data in RAW: - %s', JSON.stringify(result));
         return result;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getRawUsageById] failed to get raw usages by Id - %s', error.message);
         throw error;
      }
   }

   async getUsageDiscrepancies(contractId, usageId, partnerUsageId) {
      try {
         const url = this.adapterConfig.url +
             '/api/v1/contracts/' +
             contractId +
             '/usages/'+
             usageId+
             '/discrepancy/?partnerUsageId='+
             partnerUsageId;
         const lists = await got(url).json();
         this.getLogger().debug(
             '[CommonAdapter::getUsageDiscrepancies] get usage discrepancies of contractId-' +
             contractId +
             ': - %s',
             JSON.stringify(lists),
         );
         return lists;
      } catch (error) {
         this.getLogger().error(
             '[CommonAdapter::getUsageDiscrepancies] get usage discrepancies of contractId-' +
             contractId +
             ' - %s',
             error.message,
         );
         throw error;
      }
   }

   async createUsage(contractId, data) {
      try {
         const response = await got.post(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/',
            {
               json: data,
               responseType: 'json',
            },
         );

         this.getLogger().debug('[CommonAdapter::createUsage] create new Usage: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::createUsage] failed to create usage - %s', error.message);
         throw error;
      }
   }

   async updateUsage(contractId, usageId, data) {
      try {
         const response = await got.put(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId,
            {
               json: data,
               responseType: 'json',
            },
         );

         this.getLogger().debug('[CommonAdapter::updateUsage] update Usage: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::updateUsage] failed to update usage - %s', error.message);
         throw error;
      }
   }

   async deleteUsage(contractId, usageId) {
      try {
         const response = await got.delete(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId,
            {
               responseType: 'json'
            },
         );
         this.getLogger().debug('[CommonAdapter::deleteUsage] delete usage: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::deleteUsage] failed to delete usage - %s', error.message);
         throw error;
      }
   }

   async sendUsageById(contractId, usageId) {
      try {
         const response = await got.put(
             this.adapterConfig.url +
             '/api/v1/contracts/' +
             contractId +
             '/usages/' +
             usageId +
             '/send/',
             {responseType: 'json'},
         );
         this.getLogger().debug(
             '[CommonAdapter::sendUsageById] sent usage to partner: - %s',
             JSON.stringify(response.body),
         );
         return response.body;
      } catch (error) {
         this.getLogger().error(
             '[CommonAdapter::sendUsageById] failed to send usage - %s',
             error.message,
         );
         throw error;
      }
   }

   async rejectUsageById(contractId, usageId) {
      try {
         const response = await got.put(
             this.adapterConfig.url +
             '/api/v1/contracts/' +
             contractId +
             '/usages/' +
             usageId +
             '/reject/',
             {responseType: 'json'},
         );
         this.getLogger().debug(
             '[CommonAdapter::rejectUsageById] reject usage to partner: - %s',
             JSON.stringify(response.body),
         );
         return response.body;
      } catch (error) {
         this.getLogger().error(
             '[CommonAdapter::rejectUsageById] failed to reject usage - %s',
             error.message,
         );
         throw error;
      }
   }

   async getUsageSignaturesById(contractId, usageId, signatureId, addIdentity = false) {
      try {
         const signature = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId + '/signatures/' + signatureId).json();
         if (addIdentity) {
            if (signature.certificate) {
               const x509 = cryptoUtils.parseCert(signature.certificate);
               const identity = x509.subject.str;
               signature['identity'] = (identity) ? identity : 'Unknown';
            }
         }
         return signature;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getSignatures] failed to get all usage signatures - %s', error.message);
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_SIGNATURE,
            message: 'Failed to get signature',
         }));
      }
   }

   async getUsageSignatures(contractId, usageId, addIdentities = false) {
      try {
         const lists = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId +'/usages/' + usageId + '/signatures/').json();
         this.getLogger().debug('[CommonAdapter::getSignatures] get all usage signatures: - %s', JSON.stringify(lists));
         const processed = [];
         for (const item of lists) {
            if (item.state === 'SIGNED') {
               const result = await this.getUsageSignaturesById(contractId, item.usageId, item.signatureId, addIdentities);
               processed.push(result);
            }
         }
         return processed;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getSignatures] failed to get usage signatures - %s', error.message);
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_SIGNATURE,
            message: 'Failed to get all usage signatures',
         }));
      }
   }

   async signUsage(contractId, usageId, certificate, signatureAlgo, signature) {
      try {
         const payload = {
            certificate: certificate,
            algorithm: signatureAlgo,
            signature: signature,
         };
         this.getLogger().debug('[CommonAdapter::signUsage] signing usage: - %s', JSON.stringify(payload));
         const response = await got.post(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId + '/signatures/',
             {
                json: payload,
                responseType: 'json'
             }
         );
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::signUsage] failed to sign usage - %s', error.message);
         let errorMessage = 'Failed to sign usage';
         // TODO common adapter -> not clear if already signed or other error
         if (error.response && error.response.statusCode === 422) {
            errorMessage = 'Already signed or missing parameter';
         }
         throw new Error(JSON.stringify({
            code: ErrorCodes.ERR_SIGNATURE,
            message: errorMessage,
         }));
      }
   }

   async generateSettlementsById(contractId, usageId) {
      try {
         const response = await got.put(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/usages/' + usageId + '/generate/',
            {
               responseType: 'json'
            },
         );
         this.getLogger().debug('[CommonAdapter::createContract] generate settlement: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::createContract] failed to generate settlement - %s', error.message);
         throw error;
      }
   }

   async getSettlements(contractId) {
      try {
         const lists = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/settlements/',
         ).json();
         this.getLogger().debug('[CommonAdapter::getSettlements] get all Settlements of contractId-' + contractId + ': - %s', JSON.stringify(lists));
         return lists;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getSettlements] failed to getSettlements of contractId:' + contractId + ' - %s', error.message);
         throw error;
      }
   }

   async getSettlementsById(contractId, settlementId) {
      try {
         const item = await got(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/settlements/' + settlementId).json();
         this.getLogger().debug('[CommonAdapter::getSettlementsById] get settlements by Id: - %s', JSON.stringify(item));
         return item;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::getSettlementsById] failed to get settlements - %s', error.message);
         throw error;
      }
   }

   async getSettlementDiscrepancies(contractId, settlementId, partnerSettlementId) {
      try {
         const url = this.adapterConfig.url +
             '/api/v1/contracts/' +
             contractId +
             '/settlements/' +
             settlementId +
             '/discrepancy/?partnerSettlementId='+
             partnerSettlementId;
         const item = await got(url).json();
         this.getLogger().debug(
            '[CommonAdapter::getSettlementDiscrepancies] get settlement discrepancies: - %s',
            JSON.stringify(item),
         );
         return item;
      } catch (error) {
         this.getLogger().error(
            '[CommonAdapter::getSettlementDiscrepancies] failed to get settlement discrepancies - %s',
            error.message,
         );
         throw error;
      }
   }

   async sendSettlementsById(contractId, settlementId) {
      try {
         const response = await got.put(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/settlements/' + settlementId + '/send/',
            {
               responseType: 'json'
            },
         );
         this.getLogger().debug('[CommonAdapter::sendSettlement] send settlement: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::sendSettlement] failed to send settlement - %s', error.message);
         throw error;
      }
   }

   async rejectSettlementsById(contractId, settlementId) {
      try {
         const response = await got.put(this.adapterConfig.url + '/api/v1/contracts/' + contractId + '/settlements/' + settlementId + '/reject/',
            {
               responseType: 'json'
            },
         );
         this.getLogger().debug('[CommonAdapter::rejectSettlement] reject settlement: - %s', JSON.stringify(response.body));
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::rejectSettlement] failed to reject settlement - %s', error.message);
         throw error;
      }
   }

   async discovery(msp) {
      try {
         let response;
         if (msp) {
            response = await got(this.adapterConfig.url + '/api/v1/discovery/msps/' + msp);
         } else {
            response = await got(this.adapterConfig.url + '/api/v1/discovery/msps');
         }
         return response.body;
      } catch (error) {
         this.getLogger().error('[CommonAdapter::discovery] failed to discover msp - %s', error.message);
         throw error;
      }
   }

   async onSetup() {}
}

module.exports = CommonAdapter;
