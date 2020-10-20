/*
    key derivation function utils

    Format:
    $argon2id                                        <-- type
    $19                                              <-- version
    $9                                               <-- timeCost
    $4096                                            <-- memoryCost
    $1                                               <-- parallelism
    $uHCIOnagdeXeLHU2caX3JAKsXRQW6XLEei8jmKpKJLE     <-- salt
    $95bYIDHxzMTBOesR0nZLHA                          <-- initial vector (nonce)
    $GNTJlziAAM3EzOX3rOS5wQ                          <-- authentication tag (mac)
    $xDGG1HBa+RSuIZ1x0/yj2SfCCM6Tz97NPeHgP/4IBdU=    <-- encrypted dek

 */

'use strict';

const crypto = require('crypto');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

const createPasswordHash = async (password, options) => {
    const hashWithParameters = await argon2.hash(password, {
        type: getType(options.type),
        timeCost: options.timeCost,
        memoryCost: options.memoryCost,
        parallelism: options.parallelism,
        saltLength: options.saltLength,
        hashLength: 32
    });
    return serialize(hashWithParameters);
};

const verify = async (passwordHashWithParameters, plainPassword) => {
    const params = passwordHashWithParameters.split('$');
    const type = params[1];
    const version = params[2];
    const memory = params[3];
    const time = params[4];
    const parallelism = params[5];
    const salt = params[6];
    const hash = params[7];
    const pchStr = `$${type}$v=${version}$m=${memory},t=${time},p=${parallelism}$${salt}$${hash}`;
    try {
        return await argon2.verify(pchStr, plainPassword);
    } catch (error) {
        throw error;
    }
};

const createDek = () => {
    return uuidv4().replace(/-/g,'');
};

const createKek = async (password, paramsAsString) => {
    try {
        // fields: [1] type, [2] version, [3] memory, [4] time, [5] parallelism, [6] salt
        const fields = paramsAsString.split('$');
        const hashWithParameters = await argon2.hash(password, {
            type: getType(fields[1]),
            memoryCost: fields[3],
            timeCost: fields[4],
            parallelism: fields[5],
            salt: Buffer.from(fields[6], 'base64'),
            hashLength: 32
        });
        return hashWithParameters.split('$')[5];
    } catch (error) {
        throw error;
    }
};

const encryptDek = async (dek, password, options) => {
    try {
        const hash = await createPasswordHash(password, options);
        const fields = hash.split('$');
        const type = fields[1];
        const version = fields[2];
        const memory = fields[3];
        const time = fields[4];
        const parallelism = fields[5];
        const salt = fields[6];
        const key = fields[7];
        const [iv, authTag, encrypted] = encrypt(dek, Buffer.from(key, 'base64'));
        return '$' + type + '$' + version + '$' + memory + '$' + time + '$' + parallelism + '$' + salt + '$' + iv + '$' + authTag + '$' + encrypted;
    } catch (error) {
        throw error;
    }
};

const encryptData = (data, dek) => {
    try {
        const [iv, authTag, encrypted] = encrypt(data, dek);
        return '$' + iv + '$' + authTag + '$' + encrypted;
    } catch (error) {
        throw error;
    }
};

const decryptDek = (kek, encKey) => {
    try {
        const fields = encKey.split('$');
        const iv = fields[7];
        const authTag = fields[8];
        const encryptedKey = fields[9];
        return decrypt(encryptedKey, iv, authTag, Buffer.from(kek, 'base64'));
    } catch (error) {
        throw error;
    }
};

const decryptData = (dek, encData) => {
    try {
        const fields = encData.split('$');
        const iv = fields[1];
        const authTag = fields[2];
        const encryptedData = fields[3];
        return decrypt(encryptedData, iv, authTag, dek);
    } catch (error) {
        throw error;
    }
};

// - tools

const serialize = (hashWithParameters) => {
    const fields = hashWithParameters.split('$');
    const type = fields[1];
    const version = keyValToObj(fields[2]);
    const opts = keyValToObj(fields[3]);
    const salt = fields[4];
    const hash = fields[5];
    return '$' + type + '$' + version.v + '$' + opts.m + '$' + opts.t + '$' + opts.p + '$' + salt + '$' + hash;
};

const getType = (type) => {
    if (type === 'argon2i') {
        return argon2.argon2i;
    } else if (type === 'argon2id') {
        return argon2.argon2id;
    } else {
        return argon2.argon2d;
    }
};

const keyValToObj = (str) => {
    const obj = {};
    str.split(',').forEach(ps => {
        const pss = ps.split('=');
        obj[pss.shift()] = pss.join('=');
    });
    return obj;
};

const encrypt = (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let enc = cipher.update(text, 'utf8', 'base64');
    enc += cipher.final('base64');
    const authTag = cipher.getAuthTag();
    return [
        iv.toString('base64').replace(/=/g,''),
        authTag.toString('base64').replace(/=/g,''),
        enc
    ]
};

const decrypt = (encrypted, iv, authTag, key) => {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    let str = decipher.update(encrypted, 'base64', 'utf8');
    str += decipher.final('utf8');
    return str;
};


module.exports.createPasswordHash = createPasswordHash;
module.exports.verify = verify;
module.exports.createDek = createDek;
module.exports.createKek = createKek;
module.exports.encryptDek = encryptDek;
module.exports.encryptData = encryptData;
module.exports.decryptDek = decryptDek;
module.exports.decryptData = decryptData;
