'use strict';

const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');

class LocalStorageAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
  }

  async storeDocument(referenceId, data) {
    try {
      const documentData = {
        'referenceId': referenceId,
        'fromMSP': data.fromMSP,
        'toMSP': data.toMSP,
        'data': data.data,
        'state': data.state,
      };
      await this.getDatabase().query('INSERT INTO documents SET ?', documentData);
    } catch (error) {
      this.getLogger().error('[LocalStorageAdapter::storeDocument] failed to store document - %s', error.message);
      throw error;
    }
  }

  async updateDocument(referenceId, data) {
    try {
      await this.getDatabase().query('UPDATE documents SET ? WHERE referenceId=?', [data, referenceId]);
    } catch (error) {
      this.getLogger().error('[LocalStorageAdapter::updateDocument] failed to update document with referenceId %s - %s', referenceId, error.message);
      throw error;
    }
  }

  async getDocument(referenceId) {
    let rows;
    try {
      rows = await this.getDatabase().query('SELECT * FROM documents WHERE referenceId=?', referenceId);
    } catch (error) {
      this.getLogger().error('[LocalStorageAdapter::getDocument] failed to get document with id %s - %s', referenceId, error.message);
      throw error;
    }
    if (rows.length <= 0) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'Document not found',
      }));
    }
    return rows[0];
  }

  async getDocumentIDFromStorageKey(storageKey) {
    let rows;
    try {
      rows = await this.getDatabase().query('SELECT referenceId FROM documents WHERE fromStorageKey=? or toStorageKey=?', [storageKey, storageKey]);
    } catch (error) {
      this.getLogger().error('[LocalStorageAdapter::getDocumentIDFromStorageKey] failed to get referenceId from storageKey %s - %s', storageKey, error.message);
      throw error;
    }
    if (rows.length <= 0) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'Document not found',
      }));
    }
    return rows[0].referenceId;
  }

  async getDocuments(query) {
    let extracts = '';
    let filters = '';

    if (query) {
      if (query.extract) {
        if (Array.isArray(query.extract)) {
          for (let i=0; i < query.extract.length; i++) {
            // console.log(query.extract[i]);
            extracts += ', JSON_EXTRACT(data, "$.' + query.extract[i] + '") as `' + query.extract[i] + '`';
          }
        } else {
          extracts = ', JSON_EXTRACT(data, "$.' + query.extract + '") as `' + query.extract + '`';
        }
      }
      if (typeof query.filter === 'object' && query.filter !== null) {
        for (const [key, value] of Object.entries(query.filter)) {
          // console.log(`key=${key} value=${value}`);
          filters = ' WHERE JSON_EXTRACT(data, "$.' + key + '") = "' + value + '"';
        }
      }
    }

    const sql = 'SELECT referenceId, fromMSP, toMSP, state, ts' + extracts + ' FROM documents' + filters + ' ORDER BY ts DESC';
    this.getLogger().debug('[LocalStorageAdapter::getDocuments] sql query - %s', sql);

    try {
      return await this.getDatabase().query(sql);
    } catch (error) {
      this.getLogger().error('[LocalStorageAdapter::getDocuments] failed to get documents - %s', error.message);
      throw error;
    }
  }

  async existsDocument(referenceId) {
    try {
      const rows = await this.getDatabase().query('SELECT id FROM documents WHERE referenceId = ?', referenceId);
      if (rows.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.getLogger().error('[LocalStorageAdapter::existsDocument] failed to get document id - %s', error.message);
      throw error;
    }
  }

  async initialize() {
    await this.createTableDocuments();
  }

  async createTableDocuments() {
    try {
      await this.database.query('describe documents');
      return false;
    } catch (error) {
      if (error.errno === 1146) {
        try {
          await this.database.query(
              'CREATE TABLE IF NOT EXISTS documents (' +
              '`id` INT AUTO_INCREMENT, ' +
              '`referenceId` VARCHAR(128) NOT NULL, ' +
              '`fromMSP` VARCHAR(64) NOT NULL, ' +
              '`toMSP` VARCHAR(64) NOT NULL, ' +
              '`data` json NOT NULL, ' +
              '`state` VARCHAR(64) NOT NULL, ' +
              '`ts` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
              '`fromStorageKey` VARCHAR(64) AS (SHA2(CONCAT(fromMSP, referenceId), 256)) STORED NOT NULL, ' +
              '`toStorageKey` VARCHAR(64) AS (SHA2(CONCAT(toMSP, referenceId), 256)) STORED NOT NULL, ' +
              'PRIMARY KEY (id), ' +
              'UNIQUE INDEX referenceId (referenceId))');
          this.getLogger().info('[LocalStorageAdapter::createTableDocuments] table documents has been created successfully!');
          return true;
        } catch (error) {
          this.getLogger().error('[LocalStorageAdapter::createTableDocuments] failed to create documents table - %s ', JSON.stringify(error));
          throw error;
        }
      } else {
        this.getLogger().error('[LocalStorageAdapter::createTableDocuments] Error checking database - %s ', JSON.stringify(error));
        throw error;
      }
    }
  }
}

module.exports = LocalStorageAdapter;
