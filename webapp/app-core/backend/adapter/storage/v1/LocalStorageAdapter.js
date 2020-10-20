'use strict';

const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');

class LocalStorageAdapter extends AbstractAdapter {

    constructor(adapterName, adapterConfig, database) {
        super(adapterName, adapterConfig, database);
    }

    async storeDocument(data) {
        try {
            const documentData = {
                "documentId": data.id,
                "fromMSP": data.fromMSP,
                "toMSP": data.toMSP,
                "data": Buffer.from(data.data, 'base64').toString(),
                "dataHash": data.dataHash
            };
            await this.getDatabase().query('INSERT INTO documents SET ?', documentData);
            this.getLogger().info('[LocalStorageAdapter::storeDocument] document with id %s has been stored successfully!', data.id);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::storeDocument] failed to store document with id %s - %s', data.id, error.message);
            throw error;
        }
    }

    async getDocument(documentId) {
        let rows;
        try {
            rows = await this.getDatabase().query('SELECT * FROM documents WHERE documentId=?', documentId);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::getDocument] failed to get document with id %s - %s', documentId, error.message);
            throw error;
        }
        if (rows.length <= 0) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_NOT_FOUND,
                message: 'Document not found'
            }));
        }
        return rows[0];
    }

    async getDocuments(/*type*/) {
        try {
            // TODO: use filter like WHERE type=contract etc.
            return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP FROM documents');
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::getDocuments] failed to get documents - %s', error.message);
            throw error;
        }
    }

    async initialize() {
        try {
            await this.database.query('describe documents');
            return false;
        } catch (error) {
            if (error.errno === 1146) {
                try {
                    await this.database.query(
                        'CREATE TABLE IF NOT EXISTS documents (' +
                        'id INT AUTO_INCREMENT, ' +
                        'documentId VARCHAR(128) NOT NULL, ' +
                        'fromMSP VARCHAR(64) NOT NULL, ' +
                        'toMSP VARCHAR(64) NOT NULL, ' +
                        'data json NOT NULL, ' +
                        'dataHash VARCHAR(128) NOT NULL, ' +
                        'PRIMARY KEY (id), ' +
                        'CONSTRAINT uc_document UNIQUE (documentId))');
                    this.getLogger().info('[LocalStorageAdapter::initialize] table documents has been created successfully!');
                    return true;

                } catch (error) {
                    this.getLogger().error('[LocalStorageAdapter::initialize] failed to create documents table - %s ', JSON.stringify(error));
                    throw error;
                }
            } else {
                this.getLogger().error('[LocalStorageAdapter::initialize] Error checking database - %s ', JSON.stringify(error));
                throw error;
            }
        }
    }
}

module.exports = LocalStorageAdapter;