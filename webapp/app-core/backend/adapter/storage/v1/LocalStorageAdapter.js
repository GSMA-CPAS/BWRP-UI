'use strict';

const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');

class LocalStorageAdapter extends AbstractAdapter {

    constructor(adapterName, adapterConfig, database) {
        super(adapterName, adapterConfig, database);
    }

    async storeDocument(documentId, data) {
        try {
            const documentData = {
                "documentId": documentId,
                "type": data.type,
                "fromMSP": data.fromMSP,
                "toMSP": data.toMSP,
                "data": data.data,
                "status": data.status
            };
            await this.getDatabase().query('INSERT INTO documents SET ?', documentData);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::storeDocument] failed to store document - %s', error.message);
            throw error;
        }
    }

    async updateDocument(documentId, data) {
        try {
            await this.getDatabase().query('UPDATE documents SET ? WHERE documentId=?', [data, documentId]);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::updateDocument] failed to update document with documentId %s - %s', documentId, error.message);
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

    async getDocuments(type, status) {
        try {
            if (type && status) {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, status, `type` FROM documents WHERE `type` = ? AND status = ?', [type, status]);
            } else if (type) {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, status, `type` FROM documents WHERE `type` = ?', [type]);
            } else if (status) {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, status, `type` FROM documents WHERE status = ?', [status]);
            } else {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, status, `type` FROM documents');
            }
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::getDocuments] failed to get documents - %s', error.message);
            throw error;
        }
    }

    async existsDocument(documentId) {
        try {
            const rows = await this.getDatabase().query('SELECT id FROM documents WHERE documentId = ?', documentId);
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
                        '`documentId` VARCHAR(128) NOT NULL, ' +
                        '`type` VARCHAR(64) NOT NULL, ' +
                        '`fromMSP` VARCHAR(64) NOT NULL, ' +
                        '`toMSP` VARCHAR(64) NOT NULL, ' +
                        '`data` json NOT NULL, ' +
                        '`status` VARCHAR(64) NOT NULL, ' +
                        'PRIMARY KEY (id), ' +
                        'UNIQUE INDEX documentId (documentId))');
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