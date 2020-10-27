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
        this.passwordHashOptions = adapterConfig.passwordHashOptions;
        this.passwordKeyDerivationOptions = adapterConfig.passwordKeyDerivationOptions;
    }

    /**
     *
     * @returns {Promise<*>}
     */
    async getUsers() {
        try {
            return await this.getDatabase().query('SELECT id, username, enrollmentId, forename, surname, email, canSignDocument, active FROM users');
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::getUsers] failed to query users - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserById(userId) {

        let rows;

        try {
            rows = await this.getDatabase().query('SELECT * FROM users WHERE id=?', [userId]);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::getUserById] failed to query user with id %s - %s', userId, error.message);
            throw error;
        }

        if (rows.length <= 0) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_NOT_FOUND,
                message: 'User not found'
            }));
        }

        return rows[0];
    }

    /**
     *
     * @param username
     * @returns {Promise<*>}
     */
    async getUserByName(username) {

        let rows;

        try {
            rows = await this.getDatabase().query('SELECT * FROM users WHERE username=?', [username]);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::getUserByName] failed to query username %s - %s', username, error.message);
            throw error;
        }

        if (rows.length <= 0) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_NOT_FOUND,
                message: 'Username not found'
            }));
        }

        return rows[0];
    }

    /**
     *
     * @param username
     * @returns {Promise<boolean>}
     */
    async existsUser(username) {
        try {
            const rows = await this.getDatabase().query('SELECT * FROM users WHERE username=?', [username]);
            if (rows.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::existsUser] failed to query username %s - %s', username, error.message);
            return false;
        }
    }

    /**
     *
     * @param user
     * @param password
     * @returns {Promise<boolean>}
     */
    async comparePassword(user, password) {
        try {
            return pbkdfUtils.verify(user.password, password);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::comparePassword] failed to compare password - %s', error.message);
            return false;
        }
    }

    /**
     *
     * @param user
     * @param attempts
     * @returns {Promise<void>}
     */
    async setLoginAttempts(user, attempts) {
        try {
            await this.getDatabase().query('UPDATE users SET loginAttempts=? WHERE id=?', [attempts, user.id]);
            this.getLogger().info('[UserManagementAdapter] set failed login attempts for user %s to %s', user.username, attempts);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::setLoginAttempts] failed to set failed login attempts for user %s to %s - %s', user.username, attempts, error.message);
        }
    }

    /**
     *
     * @param adminUser
     * @param newUser
     * @returns {Promise<boolean>}
     */
    async createUser(adminUser, newUser) {

        const username = newUser.username;
        const password = newUser.password;

        if (!username) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: username'
            }));
        }

        if (!(/^[a-z0-9_]*$/.test(username))) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Username must contain only lowercase letters, numbers and underscores'
            }));
        }

        if (username.length < 3) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Username must be at least 3 characters'
            }));
        }

        if (username.length > 30) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Username must not be greater than 30 characters'
            }));
        }

        if (!password) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: password'
            }));
        }

        try {
            this.validatePassword(password);
        } catch(error) {
            throw error;
        }

        const existsDBUser = await this.existsUser(username);

        if (existsDBUser) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_DUPLICATE_ENTRY,
                message: 'Username already exists'
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

    /**
     *
     * @param userId
     * @param data
     * @returns {Promise<void>}
     */
    async updateUser(userId, data) {

        if (data.username) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Username can not be updated'
            }));
        }

        if (data.password) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Password can not be updated'
            }));
        }

        if (data.privateKey) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Private key can not be updated'
            }));
        }

        if (data.canSignDocument) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'CanSignDocument can not be updated'
            }));
        }

        let affectedRows = 0;

        try {
            let result = await this.getDatabase().query('UPDATE users SET ? WHERE id=?', [data, userId]);
            affectedRows = result.affectedRows;
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::updateUser] failed to update user with id %s - %s', userId, error.message);
            throw error;
        }

        if (affectedRows === 0) {
            this.getLogger().error('[UserManagementAdapter::updateUser] failed to update user - user id %s not found', userId);
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_NOT_FOUND,
                message: 'User not found'
            }));
        }
    }

    /**
     *
     * @param user
     * @param data
     * @returns {Promise<void>}
     */
    async updatePassword(user, data) {

        const password = data.password;
        const newPassword = data.newPassword;
        const confirmNewPassword = data.confirmNewPassword;

        if (!password) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: password'
            }));
        }

        if (!newPassword) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: newPassword'
            }));
        }

        try {
            this.validatePassword(newPassword);
        } catch(error) {
            throw error;
        }

        if (!confirmNewPassword) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: confirmNewPassword'
            }));
        }

        if (newPassword !== confirmNewPassword) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'New password and confirmation password do not match'
            }));
        }

        const isPasswordCorrect = await this.comparePassword(user, password);

        if (!isPasswordCorrect) {
            this.getLogger().error('[UserManagementAdapter::updatePassword] failed to update password for user %s - the old password is not correct!', user.username);
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_FORBIDDEN,
                message: 'Password is not correct'
            }));
        }

        try {
            const pwdEncKey = await this.updatePasswordAndEncKeys(user, password, newPassword);
            await this.getDatabase().query('UPDATE users SET password=?, encKey=?, mustChangePassword=0 WHERE id=?', [
                pwdEncKey.passwordHash,
                pwdEncKey.encKey,
                user.id
            ]);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::updatePassword] failed to update password for user %s - %s', user.username, error.message);
            throw error;
        }
    }

    /**
     *
     * @param username
     * @returns {Promise<void>}
     */
    async deleteUser(username) {
        try {
            await this.getDatabase().query('Delete from users WHERE username=?', [
               username
            ]);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::deleteUser] failed to delete user %s - %s', username, error.message);
            throw error;
        }
    }

    /**
     *
     * @param adminUser
     * @param data
     * @returns {Promise<void>}
     */
    async resetPassword(adminUser, data) {

        const userId = data.userId;
        const newPassword = data.newPassword;

        if (!userId) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: userId'
            }));
        }

        if (!newPassword) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_MISSING_PARAMETER,
                message: 'Missing parameter: newPassword'
            }));
        }

        try {
            this.validatePassword(newPassword);
        } catch(error) {
            throw error;
        }

        let user;

        try {
            user = await this.getUserById(userId, false);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::resetPassword] failed to query user with id "%s" - %s', userId, error.message);
            throw error;
        }

        if (user.username === 'admin') {
            this.getLogger().warn('[UserManagementAdapter::resetPassword] failed to reset password for %s', user.username);
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_VALIDATION,
                message: 'Admin password cannot be reset'
            }));
        }

        try {
            const pwdKeys = await this.createPasswordHashAndEncKeys(newPassword);
            await this.getDatabase().query('UPDATE users SET password=?, encKey=?, mustChangePassword=1, twoFactorSecret="" WHERE id=?', [
                pwdKeys.passwordHash,
                pwdKeys.encKey,
                user.id
            ]);
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::resetPassword] failed to reset password for user %s - %s', user.username, error.message);
            throw error;
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async createAdmin() {

        let adminUser;

        try {
            const pwdKeys = await this.createPasswordHashAndEncKeys('admin');
            adminUser = {
                enrollmentId: 'admin',
                username: 'admin',
                password: pwdKeys.passwordHash,
                encKey: pwdKeys.encKey
            };
            await this.getDatabase().query('INSERT INTO users SET ?', adminUser);
            this.getLogger().info('[UserManagementAdapter::createAdmin] admin user has been created successfully');
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::createAdmin] failed to create admin user - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param user
     * @returns {Promise<{imageUrl: *, secret: *}>}
     */
    async generateTwoFactorSecret(user) {
        const secret = otplib.authenticator.generateSecret();
        const otpAuth = otplib.authenticator.keyuri(user.username, 'Nodenect', secret);
        try {
            const imageURL = await qrcode.toDataURL(otpAuth);
            return {
                secret: secret,
                qrCodeImageUrl: imageURL
            }
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::generateTwoFactorSecret] failed to generate qrcode - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param user
     * @param data
     * @returns {Promise<boolean>}
     */
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

    /**
     *
     * @param user
     * @returns {Promise<void>}
     */
    async disableTwoFactor(user) {
        try {
            await this.getDatabase().query('UPDATE users SET twoFactorSecret="" WHERE id=?', [user.id]);
        } catch(error) {
            this.getLogger().error('[UserManagementAdapter::disableTwoFactor] failed to disable two-factor - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param user
     * @returns {Promise<{isEnabled: boolean}>}
     */
    async statusTwoFactor(user) {
        try {
            const userData = await this.getUserById(user.id, false);
            return {isEnabled: (userData.twoFactorSecret) ? true : false};
        } catch (error) {
            this.getLogger().error('[UserManagementAdapter::statusTwoFactor] failed to get 2fa status - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param user
     * @param data
     * @returns {Promise<boolean>}
     */
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
     * @returns {Promise<boolean>}
     */
    async initialize() {
        try {
            await this.database.query('describe users');
            return false;
        } catch (error) {
            if (error.errno === 1146) {
                try {
                    await this.database.query(
                        'CREATE TABLE IF NOT EXISTS users (' +
                        'id INT AUTO_INCREMENT, ' +
                        'enrollmentId VARCHAR(100) NOT NULL, ' +
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
                        'twoFactorSecret VARCHAR(255) NULL, ' +
                        'PRIMARY KEY (id), ' +
                        'CONSTRAINT uc_user UNIQUE (enrollmentId, username))');
                    this.getLogger().info('[UserManagementAdapter::initialize] table users has been created successfully!');
                    return true;

                } catch (error) {
                    this.getLogger().error('[UserManagementAdapter::initialize] failed to create users table - %s ', JSON.stringify(error));
                    throw error;
                }
            } else {
                this.getLogger().error('[UserManagementAdapter::initialize] Error checking database - %s ', JSON.stringify(error));
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
            throw error;
        }
    }

    validatePassword(passwordAsString) {
        const pwValidator= new PwValidator();
        pwValidator.min(8).max(255).noOfCharsets(4);
        const pwInvalidError = pwValidator.validate(passwordAsString, {asList: true, exitFirstFailure: true});

        if (pwInvalidError) {
            const errRet = pwInvalidError.map((errStr) => {
                let errorPasswordMessage = 'The used password is invalid';
                switch (errStr) {
                    case 'NOT_EMPTY':
                        errorPasswordMessage = 'Missing parameter: password';
                        break;
                    case 'TO_SHORT':
                        errorPasswordMessage = 'The password must contain at least 8 characters';
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
                    message: errorPasswordMessage
                }));
            });
        }
    }
}

module.exports = UserManagementAdapter;