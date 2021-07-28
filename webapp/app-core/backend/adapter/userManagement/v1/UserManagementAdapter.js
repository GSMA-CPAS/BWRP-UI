'use strict';

const otplib = require('otplib');
const qrcode = require('qrcode');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');
const AbstractAdapter = require(global.GLOBAL_BACKEND_ROOT + '/adapter/AbstractAdapter');
const PwValidator = require(global.GLOBAL_BACKEND_ROOT + '/libs/pwvalidator');
const pbkdfUtils = require(global.GLOBAL_BACKEND_ROOT + '/libs/pbkdfUtils');

class UserManagementAdapter extends AbstractAdapter {
  constructor(adapterName, adapterConfig, database) {
    super(adapterName, adapterConfig, database);
    this.initialAdminPassword = adapterConfig.initialAdminPassword;
    this.passwordHashOptions = adapterConfig.passwordHashOptions;
    this.passwordKeyDerivationOptions = adapterConfig.passwordKeyDerivationOptions;
  }

  async getUsers() {
    try {
      return await this.getDatabase().query('SELECT id, username, forename, surname, email, canSignDocument, active, isAdmin FROM users');
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::getUsers] failed to query users - %s', error.message);
      throw error;
    }
  }

  async getUserById(userId, withSecrets = false) {
    let rows;
    try {
      if (withSecrets) {
        rows = await this.getDatabase().query('SELECT * FROM users WHERE id=?', [userId]);
      } else {
        rows = await this.getDatabase().query('SELECT id, username, forename, surname, email, canSignDocument, active, loginAttempts, mustChangePassword, isAdmin, twoFactorSecret FROM users WHERE id=?', [userId]);
      }
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::getUserById] failed to query user with id %s - %s', userId, error.message);
      throw error;
    }
    if (rows.length <= 0) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'User not found',
      }));
    }
    return rows[0];
  }

  async getUserByName(username, withSecrets = false) {
    let rows;
    try {
      if (withSecrets) {
        rows = await this.getDatabase().query('SELECT * FROM users WHERE username=?', [username]);
      } else {
        rows = await this.getDatabase().query('SELECT id, username, forename, surname, email, canSignDocument, active, loginAttempts, mustChangePassword, isAdmin, twoFactorSecret FROM users WHERE username=?', [username]);
      }
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::getUserByName] failed to query username %s - %s', username, error.message);
      throw error;
    }
    if (rows.length <= 0) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'Username not found',
      }));
    }
    return rows[0];
  }

  async existsUser(username) {
    try {
      const rows = await this.getDatabase().query('SELECT id FROM users WHERE username=?', [username]);
      return (rows.length > 0);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::existsUser] failed to query username %s - %s', username, error.message);
      return false;
    }
  }

  async comparePassword(user, password) {
    try {
      return pbkdfUtils.verify(user.password, password);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::comparePassword] failed to compare password - %s', error.message);
      return false;
    }
  }

  async setLoginAttempts(user, attempts) {
    try {
      await this.getDatabase().query('UPDATE users SET loginAttempts=? WHERE id=?', [attempts, user.id]);
      this.getLogger().info('[UserManagementAdapter] set failed login attempts for user %s to %s', user.username, attempts);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::setLoginAttempts] failed to set failed login attempts for user %s to %s - %s', user.username, attempts, error.message);
    }
  }

  async deactivateUser(user) {
    try {
      await this.getDatabase().query('UPDATE users SET active=0, loginAttempts=0 WHERE id=?', user.id);
      this.getLogger().info('[UserManagementAdapter::deactivateUser] deactivate user %s', user.username);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::deactivateUser] failed to deactivate user %s - %s', user.username, error.message);
    }
  }

  async createUser(adminUser, newUser) {
    const username = newUser.username;
    const password = newUser.password;

    if (!username) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: username',
      }));
    }

    if (!(/^[a-z0-9_]*$/.test(username))) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Username must contain only lowercase letters, numbers and underscores',
      }));
    }

    if (username.length < 3) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Username must be at least 3 characters',
      }));
    }

    if (username.length > 30) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Username must not be greater than 30 characters',
      }));
    }

    if (!password) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: password',
      }));
    }

    try {
      this.validatePassword(password);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter] failed to validate password - %s', error.message);
      throw error;
    }

    const existsDBUser = await this.existsUser(username);

    if (existsDBUser) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_DUPLICATE_ENTRY,
        message: 'Username already exists',
      }));
    }

    try {
      const pwdKeys = await this.createPasswordHashAndEncKeys(password);
      newUser['password'] = pwdKeys.passwordHash;
      newUser['encKey'] = pwdKeys.encKey;
      newUser['mustChangePassword'] = true;
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::createUser] failed to generate password hash and keys for user %s - %s', username, error.message);
      throw error;
    }

    try {
      await this.getDatabase().query('INSERT INTO users SET ?', newUser);
      this.getLogger().info('[UserManagementAdapter::createUser] user %s has been created successfully!', username);
      return true;
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::createUser] failed to insert new user %s - %s', username, error.message);
      throw error;
    }
  }

  async updateUser(userId, data) {
    if (data.forename === undefined) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Missing parameter: forename',
      }));
    }

    if (data.surname === undefined) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Missing parameter: surname',
      }));
    }

    if (data.email === undefined) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Missing parameter: email',
      }));
    }

    if (data.active === undefined) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Missing parameter: active',
      }));
    }

    if (data.isAdmin === undefined) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'Missing parameter: isAdmin',
      }));
    }

    const newData = {};
    newData.forename = data.forename;
    newData.surname = data.surname;
    newData.email = data.email;
    newData.active = data.active;
    newData.isAdmin = data.isAdmin;

    let affectedRows = 0;

    try {
      const result = await this.getDatabase().query('UPDATE users SET ? WHERE id=?', [newData, userId]);
      affectedRows = result.affectedRows;
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::updateUser] failed to update user with id %s - %s', userId, error.message);
      throw error;
    }

    if (affectedRows === 0) {
      this.getLogger().error('[UserManagementAdapter::updateUser] failed to update user - user id %s not found', userId);
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_NOT_FOUND,
        message: 'User not found',
      }));
    }
  }

  async updatePassword(user, data) {
    const password = data.password;
    const newPassword = data.newPassword;
    const confirmNewPassword = data.confirmNewPassword;

    if (!password) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: password',
      }));
    }

    if (!newPassword) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: newPassword',
      }));
    }

    try {
      this.validatePassword(newPassword);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::updatePassword] failed to validate password - %s', error.message);
      throw error;
    }

    if (!confirmNewPassword) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: confirmNewPassword',
      }));
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'New password and confirmation password do not match',
      }));
    }

    const userWithSecrets = await this.getUserById(user.id, true);
    user['password'] = userWithSecrets.password;
    user['encKey'] = userWithSecrets.encKey;
    const isPasswordCorrect = await this.comparePassword(user, password);

    if (!isPasswordCorrect) {
      this.getLogger().error('[UserManagementAdapter::updatePassword] failed to update password for user %s - the old password is not correct!', user.username);
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_FORBIDDEN,
        message: 'Password is not correct',
      }));
    }

    try {
      const pwdEncKey = await this.updatePasswordAndEncKeys(user, password, newPassword);
      await this.getDatabase().query('UPDATE users SET password=?, encKey=?, mustChangePassword=0 WHERE id=?',
          [
            pwdEncKey.passwordHash,
            pwdEncKey.encKey,
            user.id,
          ]);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::updatePassword] failed to update password for user %s - %s', user.username, error.message);
      throw error;
    }
  }

  async deleteUser(adminUser, userId) {
    if (adminUser.id === userId) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'User cannot delete himself',
      }));
    }
    try {
      await this.getDatabase().query('DELETE FROM users WHERE id=?', [userId]);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::deleteUser] failed to delete user with id %s - %s', userId, error.message);
      throw error;
    }
  }

  async resetPassword(adminUser, data) {
    const userId = data.userId;
    const newPassword = data.newPassword;

    if (adminUser.id === userId) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_VALIDATION,
        message: 'User cannot reset own password',
      }));
    }

    if (!userId) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: userId',
      }));
    }

    if (!newPassword) {
      throw new Error(JSON.stringify({
        code: ErrorCodes.ERR_MISSING_PARAMETER,
        message: 'Missing parameter: newPassword',
      }));
    }

    try {
      this.validatePassword(newPassword);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::resetPassword] failed to validate password - %s', error.message);
      throw error;
    }

    let user;

    try {
      user = await this.getUserById(userId, false);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::resetPassword] failed to query user with id "%s" - %s', userId, error.message);
      throw error;
    }

    try {
      const pwdKeys = await this.createPasswordHashAndEncKeys(newPassword);
      await this.getDatabase().
          query('UPDATE users SET password=?, encKey=?, mustChangePassword=1, twoFactorSecret="" WHERE id=?',
              [
                pwdKeys.passwordHash,
                pwdKeys.encKey,
                user.id,
              ]);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::resetPassword] failed to reset password for user %s - %s', user.username, error.message);
      throw error;
    }
  }

  async getUserIdentities(userId) {
    try {
      return await this.getDatabase().query('SELECT ui.id, ui.name FROM users_identities_relation uir INNER JOIN users_identities ui ON uir.identity_id=ui.id WHERE uir.user_id=?', [userId]);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::getIdentities] failed to query user identities %s', error.message);
      throw error;
    }
  }

  async addIdentities(userId, arrIdentityIds) {
    const values = [];
    for (const identityId of arrIdentityIds) {
      if (identityId != null) {
        values.push([userId, identityId]);
      }
    }
    try {
      if (values.length > 0) {
        await this.getDatabase().query('INSERT INTO users_identities_relation (user_id, identity_id) VALUES ?', [values]);
      }
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::addIdentities] failed to add identities - %s', error.message,);
      throw error;
    }
  }

  async removeIdentities(userId, arrIdentityIds) {
    const values = [];
    for (const identityId of arrIdentityIds) {
      if (identityId != null) {
        values.push([identityId]);
      }
    }
    try {
      if (values.length > 0) {
        await this.getDatabase().query('DELETE FROM users_identities_relation WHERE user_id=? AND identity_id IN (?)', [userId, values]);
      }
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::removeIdentities] failed to remove identities - %s', error.message,);
      throw error;
    }
  }

  async createAdmin() {
    let adminUser;
    try {
      const pwdKeys = await this.createPasswordHashAndEncKeys(this.initialAdminPassword);
      adminUser = {
        username: 'admin',
        password: pwdKeys.passwordHash,
        encKey: pwdKeys.encKey,
        isAdmin: true,
      };
      await this.getDatabase().query('INSERT INTO users SET ?', adminUser);
      this.getLogger().info('[UserManagementAdapter::createAdmin] admin user has been created successfully');
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::createAdmin] failed to create admin user - %s', error.message);
      throw error;
    }
  }

  async generateTwoFactorSecret(user) {
    const secret = otplib.authenticator.generateSecret();
    const otpAuth = otplib.authenticator.keyuri(user.username, 'Nodenect', secret);
    try {
      const imageURL = await qrcode.toDataURL(otpAuth);
      return {
        secret: secret,
        qrCodeImageUrl: imageURL,
      };
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::generateTwoFactorSecret] failed to generate qrcode - %s', error.message);
      throw error;
    }
  }

  async enableTwoFactor(user, data) {
    const secret = data.secret;
    const token = data.token;

    let isValid = false;
    let encryptedSecret = '';

    try {
      isValid = otplib.authenticator.check(token, secret);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::enableTwoFactor] failed to verify 2fa token - %s', error.message);
      throw error;
    }

    if (isValid) {
      try {
        const dek = pbkdfUtils.decryptDek(user.kek, user.encKey);
        encryptedSecret = await pbkdfUtils.encryptData(secret, dek);
        await this.getDatabase().query('UPDATE users SET twoFactorSecret=? WHERE id=?', [encryptedSecret, user.id]);
        return true;
      } catch (error) {
        this.getLogger().error('[UserManagementAdapter::enableTwoFactor] failed to encrypt and store two-factor secret - %s', error.message);
        throw error;
      }
    } else {
      return false;
    }
  }

  async disableTwoFactor(user) {
    try {
      await this.getDatabase().query('UPDATE users SET twoFactorSecret="" WHERE id=?', [user.id]);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::disableTwoFactor] failed to disable two-factor - %s', error.message);
      throw error;
    }
  }

  async statusTwoFactor(user) {
    try {
      const userData = await this.getUserById(user.id, false);
      return {isEnabled: (userData.twoFactorSecret) ? true : false};
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::statusTwoFactor] failed to get 2fa status - %s', error.message);
      throw error;
    }
  }

  async verifyTwoFactor(user, data) {
    const token = data.token;
    let secret;
    try {
      const dek = pbkdfUtils.decryptDek(user.kek, user.encKey);
      secret = pbkdfUtils.decryptData(dek, user.twoFactorSecret);
      return otplib.authenticator.check(token, secret);
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::verifyTwoFactor] failed to verify 2fa token - %s', error.message);
      throw error;
    }
  }

  /**
   * Returns true if users table was created, false if table already exists.
   * @return {Promise<boolean>}
   */
  async onSetup() {
    try {
      await this.database.query('describe users');
      return false;
    } catch (error) {
      if (error.errno === 1146) {
        try {
          await this.database.query(
              'CREATE TABLE IF NOT EXISTS users (' +
              'id INT AUTO_INCREMENT, ' +
              'username VARCHAR(100) NOT NULL, ' +
              'password VARCHAR(255) NOT NULL, ' +
              'forename VARCHAR(255) NULL, ' +
              'surname VARCHAR(255) NULL, ' +
              'email VARCHAR(255) NULL, ' +
              'encKey TEXT NOT NULL, ' +
              'canSignDocument TINYINT NULL DEFAULT 0, ' +
              'active TINYINT NULL DEFAULT 1, ' +
              'loginAttempts TINYINT NULL DEFAULT 0, ' +
              'mustChangePassword TINYINT NULL DEFAULT 0, ' +
              'isAdmin TINYINT NULL DEFAULT 0, ' +
              'twoFactorSecret VARCHAR(255) NULL, ' +
              'PRIMARY KEY (id), ' +
              'CONSTRAINT uc_user UNIQUE (username))');
          this.getLogger().info('[UserManagementAdapter::onSetup] table users has been created successfully!');
          return true;
        } catch (error) {
          this.getLogger().error('[UserManagementAdapter::onSetup] failed to create users table - %s ', JSON.stringify(error));
          throw error;
        }
      } else {
        this.getLogger().error('[UserManagementAdapter::onSetup] Error checking database - %s ', JSON.stringify(error));
        throw error;
      }
    }
  }

  async createPasswordHashAndEncKeys(password) {
    const obj = {};
    try {
      // create user login password hash
      obj['passwordHash'] = await pbkdfUtils.createPasswordHash(password, this.passwordHashOptions);
      // create dek
      const dek = pbkdfUtils.createDek();
      // create kek and encrypt dek
      obj['encKey'] = await pbkdfUtils.encryptDek(dek, password, this.passwordKeyDerivationOptions);
      return obj;
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::createPasswordHashAndEncKeys] failed to create pwd hash and enc key - %s ', error.message);
      throw error;
    }
  }

  async updatePasswordAndEncKeys(user, oldPassword, newPassword) {
    const obj = {};
    // set new user login password hash
    obj['passwordHash'] = await pbkdfUtils.createPasswordHash(newPassword, this.passwordHashOptions);
    const encKey = user.encKey;
    try {
      // decrypt dek with old kek
      const dek = pbkdfUtils.decryptDek(user.kek, encKey);
      // create new kek and encrypt dek
      obj['encKey'] = await pbkdfUtils.encryptDek(dek, newPassword, this.passwordKeyDerivationOptions);
      return obj;
    } catch (error) {
      this.getLogger().error('[UserManagementAdapter::updatePasswordAndEncKeys] failed to update pwd and enc key - %s ', error.message);
      throw error;
    }
  }

  validatePassword(passwordAsString) {
    const pwValidator = new PwValidator();
    pwValidator.min(12).max(255).noOfCharsets(4);
    const pwInvalidError = pwValidator.validate(passwordAsString, {asList: true, exitFirstFailure: true});

    if (pwInvalidError) {
      pwInvalidError.map((errStr) => {
        let errorPasswordMessage = 'The used password is invalid';
        switch (errStr) {
          case 'NOT_EMPTY':
            errorPasswordMessage = 'Missing parameter: password';
            break;
          case 'TO_SHORT':
            errorPasswordMessage = 'The password must contain at least 12 characters';
            break;
          case 'TO_LONG':
            errorPasswordMessage = 'The password may contain a maximum of 255 characters';
            break;
          case 'AT_LEAST_X_OF_4_CHARACTER_SETS':
            errorPasswordMessage = 'The password must contain at least: 1 uppercase letter (A-Z), 1 lowercase letter (a-z), 1 number (0-9), and one special character (E.g. , . _ & ? etc)';
            break;
        }
        throw new Error(JSON.stringify({
          code: ErrorCodes.ERR_VALIDATION,
          message: errorPasswordMessage,
        }));
      });
    }
  }
}

module.exports = UserManagementAdapter;
