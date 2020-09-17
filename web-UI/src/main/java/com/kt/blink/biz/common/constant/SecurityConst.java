/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.constant;

/**
 * RSA Constant Class
 */
public class SecurityConst {

    /** RSA : public key **/
    public static final String PUBLIC_KEY = "RasPublic";
    
    /** RSA : private key **/
    public static final String PRIVATE_KEY = "RasPrivate";
    
    /** RSA : public key modulus **/
    public static final String PUBLIC_KEY_MODULUS = "RsaModulus";
    
    /** RSA : public key exponent **/
    public static final String PUBLIC_KEY_EXPONENT = "RsaExponent";
    
    /** RSA : RSA Group Id : RSA **/
    public static final String RSA_GROUP_ID = "RSA";
    
    /** RSA : Key Factory Algo : RSA **/
    public static final String KEY_FACTORY_ALGO = "RSA";
    
    /** RSA : Chiper Alog : RSA/ECB/PKCS1Padding **/
    public static final String RSA_CHIPER_ALGO = "RSA/ECB/PKCS1Padding";
    
    /** AES : Chiper Alog : AES/ECB/PKCS5Padding **/
    public static final String AES_CHIPER_ALGO = "AES/CBC/PKCS5Padding";
    
    /** Standard Charset : UTF-8 **/
    public static final String STANDARD_CHARSETS = "UTF-8";
    
    /** Secret Key Spec : AES **/
    public static final String SECRET_KEY_SPEC = "AES";
    
    /** Message Digest : SHA-256 **/
    public static final String MESSAGE_DIGEST = "SHA-256";
    
    private SecurityConst() {
        throw new IllegalStateException("Non-instantiable Constant Class");
    }
}
