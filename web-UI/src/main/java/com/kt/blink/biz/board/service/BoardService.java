package com.kt.blink.biz.board.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.kt.blink.biz.board.domain.BoardDomain;
import com.kt.blink.biz.board.mapper.BoardMapper;
import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.CommonUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Board Service
 */
@Slf4j
@Transactional
@Service
public class BoardService {
    
    @Autowired
    private BoardMapper boardMapper;
    
    @Autowired
    private CommonUtil commonUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    @Autowired
    private ResponseUtil responseUtil;
    
    @Value("${blink.board.fileUploadLocation}")
    private String fileUploadLocation;
    
    
    /** 
     * @param boardDomain
     * @return
     */
    public DataTablesResponse<?> findBoard(BoardDomain boardDomain) {
        try {
            List<BoardDomain> boardDomains = Optional.ofNullable(boardMapper.findBoard(boardDomain)).orElse(Collections.emptyList());
            Long totalCount = boardDomains.stream().map(BoardDomain::getTotalCount).findFirst().orElse(0L);
            return responseUtil.dataTablesResponse(totalCount, boardDomain.getDataTablesRequest().getDraw(), boardDomains);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * @param boardDomain
     * @return
     */
    public RestResponse findBoardDetail(BoardDomain boardDomain) {
        try {
            return responseUtil.restReponse(Optional.ofNullable(boardMapper.findBoardDetail(boardDomain)).orElseGet(BoardDomain::new));
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * @param boardDomain
     */
    public RestResponse registerBoard(BoardDomain boardDomain) {
        
        try {
            
            boardMapper.saveBoard(boardDomain);
            Integer bbsId = boardDomain.getBbsId();
            
            // save file info and file
            if (bbsId != null && boardDomain.getAttachFile() != null) {
                
                MultipartFile file = boardDomain.getAttachFile();
                String orginFileNm = file.getOriginalFilename();
                
                if (!StringUtils.isEmpty(orginFileNm)) {
                    // store file
                    String fileExt = FilenameUtils.getExtension(file.getOriginalFilename());
                    String storeFileNm = UUID.randomUUID().toString() + CharConst.DOT + fileExt;
                    
                    commonUtil.storeFile(file, fileUploadLocation, storeFileNm);
                    
                    // save file info
                    boardDomain.setOriginFileNm(FilenameUtils.getName(orginFileNm));
                    boardDomain.setStoreFileNm(storeFileNm);
                    boardMapper.saveBoardAtcFile(boardDomain);
                }
                
            }
            
            return responseUtil.restReponse(boardDomain);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9002"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * @param boardDomain
     * @return
     */
    public RestResponse updateBoard(BoardDomain boardDomain) {
    	
        try {
            // update board
            boardMapper.updateBoard(boardDomain);
            Integer bbsId = boardDomain.getBbsId();
            
            // update file info and file
            if (bbsId != null && boardDomain.getAttachFile() != null) {
                
                MultipartFile file = boardDomain.getAttachFile();
                String orginFileNm = file.getOriginalFilename();
                String prevFileNm = boardDomain.getStoreFileNm();
                
                if (!StringUtils.isEmpty(orginFileNm)) {
                    
                    // delete prev stored file
                    if(!StringUtils.isBlank(prevFileNm)) {
                        commonUtil.deleteFile(fileUploadLocation, boardDomain.getStoreFileNm());
                    }
                    
                    // store new file
                    String fileExt = FilenameUtils.getExtension(file.getOriginalFilename());
                    String storeFileNm = UUID.randomUUID().toString() + CharConst.DOT + fileExt;
                    commonUtil.storeFile(file, fileUploadLocation, storeFileNm);
                    
                    // save file info
                    boardDomain.setOriginFileNm(FilenameUtils.getName(orginFileNm));
                    boardDomain.setStoreFileNm(storeFileNm);
                    boardMapper.updateBoardAtcFile(boardDomain);
                }
                
            }
            
            return responseUtil.restReponse(boardDomain);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * delete board
     * 
     * @param bbsId
     */
    public RestResponse deleteBoard(Integer bbsId) {
        try {
            
            String storeFileNm = boardMapper.findBoardAtcFileNameById(bbsId);
            log.info("[storeFileNm]===============>{}", storeFileNm);
            int bdrc = boardMapper.deleteBoardById(bbsId);
            log.info("[bdrc]===============>{}", bdrc);
            
            // delete file info and file
            if (bdrc != NumberUtils.INTEGER_ZERO && !StringUtils.isEmpty(storeFileNm)) {
                int fdrc = boardMapper.deleteBoardAtcFileById(bbsId);
                log.info("[fdrc]===============>{}", fdrc);
                if (fdrc != NumberUtils.INTEGER_ZERO) {
                    commonUtil.deleteFile(fileUploadLocation, storeFileNm);
                }
            }
            return responseUtil.restReponse(bbsId);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9004"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * increase board view count
     * 
     * @param bbsId
     */
    public RestResponse increaseHitCountById(Integer bbsId) {
        try {
            boardMapper.increaseHitCountById(bbsId);
            return responseUtil.restReponse(bbsId);
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9003"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    /**
     * download file
     * 
     * @param response
     * @param originFileNm
     * @param sotreFileNm
     */
    public void downloadAtcFile(HttpServletResponse response, ServletContext servletContext, @RequestParam("originFileNm") String originFileNm, @RequestParam("sotreFileNm") String sotreFileNm) {
        log.info("originFileNm : [{}], sotreFileNm : [{}]", originFileNm, sotreFileNm);
        commonUtil.downloadFile(response, servletContext, fileUploadLocation, originFileNm, sotreFileNm);
    }
    
    
    
}
