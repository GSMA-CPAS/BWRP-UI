/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.common.utils;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.constant.SecurityConst;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.service.CodeInfoService;

/**
 * RSA Util
 */
@Component
public class RSAUtil {
	
	private static final String RSA_UTIL_ERR = "RSA Util error has occured";
    
    @Autowired
    private CodeInfoService codeInfoService;
    
    /**
     * RSA Public Key
     * 
     * @return
     */
    public String getRSAPublicKey() {
        return codeInfoService.findCodeByCdIdAndCdGrpId(SecurityConst.PUBLIC_KEY, SecurityConst.RSA_GROUP_ID).getCdVal1();
    }
    
    
    /**
     * RSA Private Key
     * 
     * @return
     */
    public String getRSAPrivateKey() {
        return codeInfoService.findCodeByCdIdAndCdGrpId(SecurityConst.PRIVATE_KEY, SecurityConst.RSA_GROUP_ID).getCdVal1();
    }
    
    
    /**
     * RSA Public Key Modulus
     * 
     * @return
     */
    public String getRSAPublicKeyModulus() {
        return codeInfoService.findCodeByCdIdAndCdGrpId(SecurityConst.PUBLIC_KEY_MODULUS, SecurityConst.RSA_GROUP_ID).getCdVal1();
    }
    
    
    /**
     * RSA Private Key Exponent
     * 
     * @return
     */
    public String getRSAPrivateKeyExponent() {
        return codeInfoService.findCodeByCdIdAndCdGrpId(SecurityConst.PUBLIC_KEY_EXPONENT, SecurityConst.RSA_GROUP_ID).getCdVal1();
    }
    
    
    /**
     * User Password Decrypt
     * 
     * @param value
     * @param sPrivateKey
     * @return
     */
    public String webDecrypt(String str, String sPrivateKey) {
        
        try {
            byte[] bPrivateKey = Base64.decodeBase64(sPrivateKey.getBytes());
            KeyFactory keyFactory = KeyFactory.getInstance(SecurityConst.KEY_FACTORY_ALGO);
            
            PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bPrivateKey);
            PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);
            
            Cipher cipher = Cipher.getInstance(SecurityConst.RSA_CHIPER_ALGO);
            byte[] encryptBytes = Hex.decodeHex(str);
            
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] bPlain = cipher.doFinal(encryptBytes);
            return new String(bPlain);
        } catch (Exception ex) {
            throw new CommonException(RSA_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    

}
