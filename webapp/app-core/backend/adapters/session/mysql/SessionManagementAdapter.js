'use strict';

const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapters/AbstractAdapter');

class SessionManagementAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
  }

  async onSetup() {
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
          this.getLogger().info('[SessionManagementAdapter::onSetup] table sessions has been created successfully!');
          return true;
        } catch (error) {
          this.getLogger().error('[SessionManagementAdapter::onSetup] failed to create sessions table - %s ', JSON.stringify(error));
          throw error;
        }
      } else {
        this.getLogger().error('[SessionManagementAdapter::onSetup] Error checking database - %s ', JSON.stringify(error));
        throw error;
      }
    }
  }
}

module.exports = SessionManagementAdapter;

