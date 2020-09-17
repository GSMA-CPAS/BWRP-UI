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

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.util.StringUtils;

import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;

import lombok.extern.slf4j.Slf4j;

/**
 * Common Util
 */
@Slf4j
@Component
public class CommonUtil {
    
    /** Common Util Error Messaage **/
    public static final String COMN_UTIL_ERR = "An error has occured while processing your request";
    
    public static final String COMN_UTIL_FILE_TYPE_ERR = "This file type is not allowed to upload";
    
    
    /**
     * check restrict file upload extension
     * 
     * @param file
     * @return
     */
    public boolean restrictUploadFileExtension(MultipartFile file) {
        String imageExt = FilenameUtils.getExtension(file.getOriginalFilename());
        
        List<String> notAllowedFileList = Arrays.asList("ade", "adp", "bat", "chm", "cmd", "com", "cpl", "exe", "hta", 
                "ins", "isp", "jar", "jse", "js","lib", "lnk", "mde", "msc", 
                "msp", "mst", "pif", "scr", "sct", "shb", "sys", "vb", "vbe", 
                "vbs", "vxd", "wsc", "wsc", "wsf", "wsh");
        return notAllowedFileList.contains(imageExt.toLowerCase());
    }
    
    
    /**
     * convert multipart file size to megabytes
     * 
     * @param file
     * @return
     */
    public int getFileSizeInMegaBytes(MultipartFile file) {
        if (file.isEmpty()) {
            return 0;
        }
        
        return (int)Math.round(file.getSize() * 0.00000095367432);
    }
    
    
    /**
     * validate upload file extension
     * 
     * @param file
     * @return
     */
    public boolean validateUploadFileExtension(MultipartFile file) {
        String imageExt = FilenameUtils.getExtension(file.getOriginalFilename());
        List<String> allowedImageExts = Arrays.asList("jpeg", "jpg", "gif", "png");
        return !allowedImageExts.contains(imageExt);
    }
    
    
    /**
     * set LocalDate to Start Of Day
     * 
     * @param localDate
     * @return
     */
    public LocalDateTime setLocalDateAtStartOfDay(LocalDate localDate) {
        return localDate.atStartOfDay();
    }
    
    
    /**
     * generate Cont detail Sequence Id
     * 
     * @param myNetworks
     * @param partnerNetworks
     * @param middleName
     * @return
     */
    public String generateContractId(List<String> myNetworks, List<String> partnerNetworks, String middleName) {
        String trmPlmnIds = myNetworks.stream().sorted().collect(Collectors.joining(CharConst.DASH));
        String rcvPlmnIds = partnerNetworks.stream().sorted().collect(Collectors.joining(CharConst.DASH));
        StringBuilder contSeqId = new StringBuilder();
        
        try {
            Thread.sleep(5);
        } catch (InterruptedException e) {
            log.debug("createing unique contract id============>");
            Thread.currentThread().interrupt();
        }
        
        return contSeqId.append(trmPlmnIds).append(CharConst.DASH).append(rcvPlmnIds)
            .append(CharConst.DASH).append(middleName).append(CharConst.DASH)
            .append(DateFormatUtils.format(new Date(), "yyyyMMddHHmmssSSSSSS")).toString();
        
    }
    
    
    /**
     * generate Cont detail Sequence Id From Cont Master Id
     * 
     * @param masterContId
     * @param middleName
     * @return
     */
    public String generateContractId(String masterContId, String middleName) {
        log.info("generateContractId===============>{}/{}", masterContId, middleName);
        StringBuilder contSeqId = new StringBuilder();
        
        try {
            Thread.sleep(5);
        } catch (InterruptedException e) {
            log.debug("createing unique contract id============>");
            Thread.currentThread().interrupt();
        }
        
        return contSeqId.append(StringUtils.substring(masterContId, 0, masterContId.indexOf(CodeConst.CONT_MASTER_ID)))
        .append(middleName).append(CharConst.DASH)
        .append(DateFormatUtils.format(new Date(), "yyyyMMddHHmmssSSSSSS")).toString();
    }
    
    
    /**
     * comma separated values
     *  
     * @param myNetworks
     * @param partnerNetworks
     * @return
     */
    public String getCommaSeparatedValues(List<String> list) {
        return list.stream().sorted().collect(Collectors.joining(CharConst.COMMA));
    }
    
    
    /**
     * save file
     * 
     * @param request, filename
     * @return
     */
    public void storeFile (MultipartFile file, String saveLocation, String saveFilename) {
            
        if (file.isEmpty()) {
            return;
        }
        
        if (this.restrictUploadFileExtension(file)) {
            throw new CommonException(CommonUtil.COMN_UTIL_FILE_TYPE_ERR, ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
        try {
            Files.copy(file.getInputStream(), Paths.get(saveLocation + saveFilename), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    
    /**
     * delete file
     * 
     * @param request, filename
     * @return
     */
    public void deleteFile(String saveLocation, String deleteFilename) {
        try {
            log.info("[DEL]=============>{}", saveLocation + deleteFilename);
            boolean deleted = Files.deleteIfExists(Paths.get(saveLocation + deleteFilename));
            log.info("[DEL]=============>{}", deleted);
        } catch (Exception ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * attach file download
     * 
     * @param response
     * @param orgFileName
     * @param chgFileName
     */
    public void downloadFile(HttpServletResponse response, ServletContext servletContext, String fileUploadLocation, String originFileNm, String storeFileNm) {
        log.info("originFileNm : [{}], storeFileNm : [{}]", originFileNm, storeFileNm);
        MediaType mediaType = this.getFileMediaType(servletContext, storeFileNm);
        
        File file = new File(fileUploadLocation + storeFileNm);
        
        try (BufferedInputStream inStream = new BufferedInputStream(new FileInputStream(file));
                BufferedOutputStream outStream = new BufferedOutputStream(response.getOutputStream());) {
            
            response.setContentType(mediaType.getType());
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + URLEncoder.encode(originFileNm,"utf-8") + ";");
            response.setContentLength((int) file.length());
        
            byte[] buffer = new byte[1024];
            int byteRead = 0;
        
            while ((byteRead = inStream.read(buffer)) != -1) {
                outStream.write(buffer, 0, byteRead);
            }
            outStream.flush();
        
        } catch (IOException e) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    
    /**
     * get mediatype of file
     * 
     * @param servletContext
     * @param fileName
     * @return
     */
    public MediaType getFileMediaType(ServletContext servletContext, String fileName) {
        try {
            String mineType = servletContext.getMimeType(fileName);
            return MediaType.parseMediaType(mineType);
        } catch (Exception e) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
    
    
}
