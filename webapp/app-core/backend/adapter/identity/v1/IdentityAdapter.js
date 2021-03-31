'use strict';

const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

class IdentityAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
  }

  async getIdentities() {
    try {
      return await this.getDatabase().query('SELECT id, name FROM users_identities');
    } catch (error) {
      this.getLogger().error('[IdentityAdapter::getIdentities] failed to query identities - %s', error.message);
      throw error;
    }
  }

  async getIdentity(id) {
    let rows;
    try {
      rows = await this.getDatabase().query('SELECT id, name FROM users_identities WHERE id=?', id);
    } catch (error) {
      this.getLogger().error('[IdentityAdapter::getIdentity] failed to get identity - %s', error.message);
      throw error;
    }
    if (rows.length <= 0) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'Identity not found',
      }));
    }
    return rows[0];
  }

  async getIdentityByName(name) {
    let rows;
    try {
      rows = await this.getDatabase().query('SELECT id, name FROM users_identities WHERE name=?', name);
    } catch (error) {
      this.getLogger().error('[IdentityAdapter::getIdentityByName] failed to get identity by name - %s', error.message);
      throw error;
    }
    if (rows.length <= 0) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'Identity not found',
      }));
    }
    return rows[0];
  }

  async existsIdentity(name) {
    try {
      const rows = await this.getDatabase().query('SELECT id FROM users_identities WHERE name=?', name);
      return (rows.length > 0);
    } catch (error) {
      this.getLogger().error('[IdentityAdapter::existsIdentity] failed to get identity by name - %s', error.message);
      throw error;
    }
  }

  async createIdentity(newIdentity) {
    const name = newIdentity.name;
    if (!name) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: name',
      }));
    }
    try {
      const result = await this.getDatabase().query('INSERT INTO users_identities SET ?', newIdentity);
      this.getLogger().info('[IdentityAdapter::createIdentity] identity %s has been created successfully!', name);
      return result;
    } catch (error) {
      this.getLogger().error('[IdentityAdapter::createIdentity] failed to insert new identity %s - %s', name, error.message);
      throw error;
    }
  }

  async deleteIdentity(identityId) {
    try {
      await this.getDatabase().query('DELETE FROM users_identities WHERE id=?', identityId);
      this.getLogger().info('[IdentityAdapter::deleteIdentity] identity id %s has been deleted successfully!', identityId);
      return true;
    } catch (error) {
      this.getLogger().error('[IdentityAdapter::deleteIdentity] failed to delete identity - %s', error.message);
      throw error;
    }
  }

  async onSetup() {
    await this.initIdentitiesTable();
    await this.initIdentitiesRelationTable();
  }

  async initIdentitiesTable() {
    const tableName = 'users_identities';
    try {
      await this.database.query('describe ' + tableName);
      return false;
    } catch (error) {
      if (error.errno === 1146) {
        try {
          await this.database.query(
              'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' +
              'id INT AUTO_INCREMENT, ' +
              'name VARCHAR(100) NOT NULL, ' +
              'PRIMARY KEY (id), ' +
              'CONSTRAINT uc_identities UNIQUE (name))');
          this.getLogger().info('[IdentityAdapter::onSetup] table %s has been created successfully!', tableName);
        } catch (error) {
          this.getLogger().error('[IdentityAdapter::onSetup] failed to create %s table - %s ', tableName, JSON.stringify(error));
          throw error;
        }
      } else {
        this.getLogger().error('[IdentityAdapter::onSetup] Error checking database - %s ', JSON.stringify(error));
        throw error;
      }
    }
  }

  async initIdentitiesRelationTable() {
    const tableName = 'users_identities_relation';
    try {
      await this.database.query('describe ' + tableName);
      return false;
    } catch (error) {
      if (error.errno === 1146) {
        try {
          await this.database.query(
              'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' +
              'user_id INT, ' +
              'identity_id INT, ' +
              'PRIMARY KEY (user_id, identity_id), ' +
              'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
              'FOREIGN KEY (identity_id) REFERENCES users_identities(id) ON DELETE CASCADE ON UPDATE CASCADE)');
          this.getLogger().info('[IdentityAdapter::onSetup] table %s has been created successfully!', tableName);
        } catch (error) {
          this.getLogger().error('[IdentityAdapter::onSetup] failed to create %s table - %s ', tableName, JSON.stringify(error));
          throw error;
        }
      } else {
        this.getLogger().error('[IdentityAdapter::onSetup] Error checking database - %s ', JSON.stringify(error));
        throw error;
      }
    }
  }
}

module.exports = IdentityAdapter;
