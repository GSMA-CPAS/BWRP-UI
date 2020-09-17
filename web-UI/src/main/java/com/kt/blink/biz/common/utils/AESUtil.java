package com.kt.blink.biz.common.utils;

import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Base64.Encoder;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.kt.blink.biz.common.constant.SecurityConst;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;

@Component
public class AESUtil {

    private static final String AES_UTIL_ERR = "AES Util error has occured";

    @Value("${blink.aesKey}")
    private String secretKey;
    
    @Value("${blink.aesVector}")
    private String initVector;
    
    
    /**
     * AES Encrypt
     * 
     * @param strToEncrypt
     * @return
     */
    public String encrypt(String string) {
        try {
            
            byte[] keyDecodeBytes = Base64.getDecoder().decode(secretKey);
            String keyDecodedString = new String(keyDecodeBytes);
            
            byte[] initVectorDecodeBytes = Base64.getDecoder().decode(initVector);
            String initVectorDecodedString = new String(initVectorDecodeBytes);
            
            IvParameterSpec iv = new IvParameterSpec(initVectorDecodedString.getBytes(SecurityConst.STANDARD_CHARSETS));
            SecretKeySpec skeySpec = new SecretKeySpec(keyDecodedString.getBytes(SecurityConst.STANDARD_CHARSETS), SecurityConst.SECRET_KEY_SPEC);

            Cipher cipher = Cipher.getInstance(SecurityConst.AES_CHIPER_ALGO);
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

            byte[] encrypted = cipher.doFinal(string.getBytes());
            Encoder encoder = Base64.getEncoder();
            return encoder.encodeToString(encrypted);
            
        } catch (Exception ex) {
            throw new CommonException(AES_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    
    /**
     * AES Decrypt
     * 
     * @param strToDecrypt
     * @return
     */
    public String decrypt(String encString) {
        try {
            
            byte[] keyDecodeBytes = Base64.getDecoder().decode(secretKey);
            String keyDecodedString = new String(keyDecodeBytes);
            
            byte[] initVectorDecodeBytes = Base64.getDecoder().decode(initVector);
            String initVectorDecodedString = new String(initVectorDecodeBytes);
            
            IvParameterSpec iv = new IvParameterSpec(initVectorDecodedString.getBytes(SecurityConst.STANDARD_CHARSETS));
            SecretKeySpec skeySpec = new SecretKeySpec(keyDecodedString.getBytes(SecurityConst.STANDARD_CHARSETS), SecurityConst.SECRET_KEY_SPEC);

            Cipher cipher = Cipher.getInstance(SecurityConst.AES_CHIPER_ALGO);
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            
            Decoder decoder = Base64.getDecoder();
            
            byte[] original = cipher.doFinal(decoder.decode(encString));

            return new String(original);
            
        } catch (Exception ex) {
            throw new CommonException(AES_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    
}
