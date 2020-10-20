'use strict';

const config = require('config');
const logger = require(global.GLOBAL_BACKEND_ROOT + '/libs/logger')(config);

class AbstractAdapter {

    constructor(adapterName, adapterConfig, database) {

        if (new.target === AbstractAdapter) {
            throw new TypeError("Cannot construct AbstractAdapter instances directly");
        }

        this.logger = logger;
        this.adapterName = adapterName;
        this.adapterConfig = adapterConfig;
        this.database = database;
    }

    getAdapterConfig() {
        return this.adapterConfig;
    }

    getDatabase() {
        return this.database;
    }

    getLogger() {
        return this.logger;
    }

    getAdapterName() {
        return this.adapterName;
    }

    checkIfSet(key, propertyName) {
        if (key) {
            return key;
        } else {
            this.logger.error('[%s] property <%s> must be set for adapter <%s> in config file', this.getAdapterName(), propertyName, this.getAdapterName());
            process.exit(1);
        }
    }
}

module.exports = AbstractAdapter;