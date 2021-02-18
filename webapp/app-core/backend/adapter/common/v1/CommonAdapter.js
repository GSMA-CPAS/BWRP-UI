"use strict";

const got = require("got");
const config = require("config");
// const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT +
  "/adapter/AbstractAdapter");
const crypto = require("crypto");

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
    return "Unknown";
  }

  getTadigCodes(body) {
    const tadigCodes = [];
    for (const [key] of Object.entries(body.framework.partyInformation)) {
      const defaultTadigCodes =
        body.framework.partyInformation[key].defaultTadigCodes;
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
      const lists = await got(
        this.adapterConfig.url + "/api/v1/contracts/"
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getContracts] get all contracts: - %s",
        JSON.stringify(lists)
      );
      const processed = [];
      for (const item of lists) {
        if (item.referenceId !== undefined) {
          processed.push({
            contractId: item.contractId,
            referenceId: item.referenceId,
            partnerMsp: this.getPartnerMsp(item.header.msps),
            state: item.state,
            lastModification: item.lastModificationDate,
            startDate:
              item.body.framework.term && item.body.framework.term.start,
            endDate: item.body.framework.term && item.body.framework.term.end,
            authors: item.body.metadata.authors,
            type: item.header.type,
            name: item.body.metadata.name,
            tadigCodes: this.getTadigCodes(item.body),
            version: item.header.version,
          });
        }
      }
      return processed;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getContracts] failed to get contracts - %s",
        error.message
      );
      throw error;
    }
  }

  // currently passing self mspid for some Payload convertion. Require some cleanup.
  async getContractById(contractId, selfMSP) {
    try {
      const item = await got(
        this.adapterConfig.url + "/api/v1/contracts/" + contractId
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getContractById] get contract: - %s",
        JSON.stringify(item)
      );

      // to be removed if not required.
      let fromSk = "";
      let toSk = "";
      for (const msp in item.header.msps) {
        if (msp === selfMSP) {
          fromSk = crypto
            .createHash("sha256")
            .update(msp + item.referenceId)
            .digest("hex")
            .toString("utf8");
        } else {
          toSk = crypto
            .createHash("sha256")
            .update(msp + item.referenceId)
            .digest("hex")
            .toString("utf8");
        }
      }

      // convert header
      const header = {
        name: item.header.name,
        type: "contract",
        version: item.header.version,
        msps: item.header.msps,
      };
      // header.msps[item.header.fromMsp.mspId] = {minSignatures: item.header.fromMsp.signatures.length};
      // header.msps[item.header.toMsp.mspId] = {minSignatures: item.header.toMsp.signatures.length};
      return {
        contractId: item.contractId,
        referenceId: item.referenceId,
        partnerMsp: this.getPartnerMsp(item.header.msps),
        data: JSON.stringify({ body: item.body, header: header }),
        state: "sent",
        creationDate: item.creationDate,
        lastModificationDate: item.lastModificationDate,
        fromStorageKey: fromSk,
        toStorageKey: toSk,
      };
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getContractById] failed to get contract - %s",
        error.message
      );
      throw error;
    }
  }

  async getRawContractById(contractId) {
    try {
      const item = await got(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/?format=RAW"
      ).json();
      item.data = item.raw;
      this.getLogger().debug(
        "[CommonAdapter::getContractById] get contract in RAW: - %s",
        JSON.stringify(item)
      );
      return item;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getContracts] failed to get contracts - %s",
        error.message
      );
      throw error;
    }
  }

  async createContract(toMsp, data) {
    try {
      const header = {
        name: data.body.metadata.name,
        type: "contract",
        version: data.header.version,
        msps: data.header.msps,
      };
      // for (const msp in data.header.msps) {
      //  if (msp === toMsp) {
      //    // header.toMsp = {mspId: msp, signatures: data.body[msp].signatures};
      //    // todo: hardcoded
      //    header.toMsp = {mspId: msp, signatures: [
      //      {
      //        'id': 'id',
      //        'name': 'name',
      //        'role': 'role'
      //      },
      //      {
      //        'id': 'id',
      //        'name': 'name',
      //        'role': 'role'
      //      }
      //    ]};
      //  } else {
      //    // header.fromMsp = {mspId: msp, signatures: data.body[msp].signatures};
      //    // todo: hardcoded
      //    header.fromMsp = {mspId: msp, signatures: [
      //      {
      //        'id': 'id',
      //        'name': 'name',
      //        'role': 'role'
      //      },
      //      {
      //        'id': 'id',
      //        'name': 'name',
      //        'role': 'role'
      //      }
      //    ]};
      //  }
      // }

      // const check = true;
      // for (const msp in data.header.msps) {
      //   // escape eslint check
      //   if (check == true) {
      //     data.header.msps[msp].minSignatures = data.body.framework.signers[msp].length;
      //   }
      // }
      const payload = { header: header, body: data.body };
      const contract = await got.post(
        this.adapterConfig.url + "/api/v1/contracts/",
        {
          json: payload,
          responseType: "json",
        }
      );

      const response = await got.put(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contract.body.contractId +
          "/send/",
        { responseType: "json" }
      );
      this.getLogger().debug(
        "[CommonAdapter::createContract] create new contract: - %s",
        JSON.stringify(response.body)
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::createContract] failed to create contract - %s",
        error.message
      );
      throw error;
    }
  }

  async getSignatures(contractId) {
    try {
      const lists = await got(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/signatures/"
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getSignatures] get all signatures of contracts: - %s",
        JSON.stringify(lists)
      );
      const processed = [];
      for (const item of lists) {
        if (item.state === "SIGNED") {
          const result = await got(
            this.adapterConfig.url +
              "/api/v1/contracts/" +
              item.contractId +
              "/signatures/" +
              item.signatureId
          ).json();
          processed.push(result);
        }
      }
      return processed;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getSignatures] failed to get all signatures - %s",
        error.message
      );
      throw error;
    }
  }

  async getSignaturesById(contractId, signatureId) {
    try {
      const response = await got(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/signatures/" +
          signatureId
      ).json();
      return response;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getSignatures] failed to get all signatures - %s",
        error.message
      );
      throw error;
    }
  }

  async signContract(contractId, certificate, signatureAlgo, signature) {
    try {
      const payload = {
        certificate: certificate,
        algorithm: signatureAlgo,
        signature: signature,
      };
      this.getLogger().debug(
        "[CommonAdapter::signContract] sigining contracts: - %s",
        JSON.stringify(payload)
      );
      const response = await got.post(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/signatures/",
        { json: payload, responseType: "json" }
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::signContract] failed to sign contracts - %s",
        error.message
      );
      throw error;
    }
  }

  async getUsages(contractId) {
    try {
      const lists = await got(
        this.adapterConfig.url + "/api/v1/contracts/" + contractId + "/usages/"
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getUsages] get all Usages of contractId-" +
          contractId +
          ": - %s",
        JSON.stringify(lists)
      );
      return lists;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getUsages] failed to getUsages of contractId:" +
          contractId +
          " - %s",
        error.message
      );
      throw error;
    }
  }

  async getUsagesById(contractId, usageId) {
    try {
      const item = await got(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/usages/" +
          usageId
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getUsagesById] get usages by Id: - %s",
        JSON.stringify(item)
      );
      return item;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getUsagesById] failed to get usages by Id - %s",
        error.message
      );
      throw error;
    }
  }

  async createUsage(contractId, data) {
    try {
      const response = await got.post(
        this.adapterConfig.url + "/api/v1/contracts/" + contractId + "/usages/",
        {
          json: data,
          responseType: "json",
        }
      );

      this.getLogger().debug(
        "[CommonAdapter::createUsage] create new Usage: - %s",
        JSON.stringify(response.body)
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::createUsage] failed to create usage - %s",
        error.message
      );
      throw error;
    }
  }

  async updateUsage(contractId, usageId, data) {
    try {
      const response = await got.put(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/usages/" +
          usageId,
        {
          json: data,
          responseType: "json",
        }
      );

      this.getLogger().debug(
        "[CommonAdapter::updateUsage] update Usage: - %s",
        JSON.stringify(response.body)
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::updateUsage] failed to update usage - %s",
        error.message
      );
      throw error;
    }
  }

  async deleteUsage(contractId, usageId) {
    try {
      const response = await got.delete(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/usages/" +
          usageId,
        { responseType: "json" }
      );
      this.getLogger().debug(
        "[CommonAdapter::deleteUsage] delete usage: - %s",
        JSON.stringify(response.body)
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::deleteUsage] failed to delete usage - %s",
        error.message
      );
      throw error;
    }
  }

  async generateSettlementsById(contractId, usageId) {
    try {
      const response = await got.put(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/usages/" +
          usageId +
          "/generate/",
        { responseType: "json" }
      );
      this.getLogger().debug(
        "[CommonAdapter::createContract] generate settlement: - %s",
        JSON.stringify(response.body)
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::createContract] failed to generate settlement - %s",
        error.message
      );
      throw error;
    }
  }

  async getSettlements(contractId) {
    try {
      const lists = await got(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/settlements/"
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getSettlements] get all Settlements of contractId-" +
          contractId +
          ": - %s",
        JSON.stringify(lists)
      );
      return lists;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getSettlements] failed to getSettlements of contractId:" +
          contractId +
          " - %s",
        error.message
      );
      throw error;
    }
  }

  async getSettlementsById(contractId, settlementId) {
    try {
      const item = await got(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/settlements/" +
          settlementId
      ).json();
      this.getLogger().debug(
        "[CommonAdapter::getSettlementsById] get settlements by Id: - %s",
        JSON.stringify(item)
      );
      return item;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::getSettlementsById] failed to get settlements - %s",
        error.message
      );
      throw error;
    }
  }

  async sendSettlementsById(contractId, settlementId) {
    try {
      const response = await got.put(
        this.adapterConfig.url +
          "/api/v1/contracts/" +
          contractId +
          "/settlements/" +
          settlementId +
          "/send/",
        { responseType: "json" }
      );
      this.getLogger().debug(
        "[CommonAdapter::createContract] create new contract: - %s",
        JSON.stringify(response.body)
      );
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::createContract] failed to create contract - %s",
        error.message
      );
      throw error;
    }
  }

  async discovery(msp) {
    try {
      let response;
      if (msp) {
        response = await got(
          this.adapterConfig.url + "/api/v1/discovery/msps/" + msp
        );
      } else {
        response = await got(this.adapterConfig.url + "/api/v1/discovery/msps");
      }
      return response.body;
    } catch (error) {
      this.getLogger().error(
        "[CommonAdapter::discovery] failed to discover msp - %s",
        error.message
      );
      throw error;
    }
  }

  async initialize() {}
}

module.exports = CommonAdapter;
