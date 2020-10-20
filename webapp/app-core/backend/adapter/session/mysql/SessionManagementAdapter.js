'use strict';

const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');

class SessionManagementAdapter extends AbstractAdapter {

    /**
     *
     * @param adapterName
     * @param adapterConfig
     * @param database
     */
    constructor(adapterName, adapterConfig, database) {
        super(adapterName, adapterConfig, database);
    }

    async initialize() {
        try {
            await this.database.query('describe sessions');
            return false;
        } catch (error) {
            if (error.errno === 1146) {
                try {
                    await this.database.query(
                        'CREATE TABLE IF NOT EXISTS sessions (' +
                        'session_id  VARCHAR(128) NOT NULL, ' +
                        'expires INT(11) UNSIGNED NOT NULL, ' +
                        'data MEDIUMTEXT NOT NULL, ' +
                        'PRIMARY KEY (session_id))');
                    this.getLogger().info('[SessionManagementAdapter::initialize] table sessions has been created successfully!');
                    return true;

                } catch (error) {
                    this.getLogger().error('[SessionManagementAdapter::initialize] failed to create sessions table - %s ', JSON.stringify(error));
                    throw error;
                }
            } else {
                this.getLogger().error('[SessionManagementAdapter::initialize] Error checking database - %s ', JSON.stringify(error));
                throw error;
            }
        }
    }
}

module.exports = SessionManagementAdapter;

