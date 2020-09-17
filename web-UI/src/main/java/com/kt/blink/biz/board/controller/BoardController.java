package com.kt.blink.biz.board.controller;

import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import com.kt.blink.biz.board.domain.BoardDomain;
import com.kt.blink.biz.board.service.BoardService;
import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.domain.datatables.Column;
import com.kt.blink.biz.common.domain.datatables.DataTablesRequest;
import com.kt.blink.biz.common.domain.datatables.DataTablesResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.DataTablesUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

/**
 * Board Controller
 */
@Slf4j
@RequestMapping("/board")
@RestController
public class BoardController {

    
    @Autowired
    private BoardService boardService;
    
    @Autowired
    private DataTablesUtil dataTablesUtil;
    
    @Autowired
    private ServletContext servletContext;
    
    @Autowired
    private MessageUtil messageUtil;
    
    @Value("${blink.upload.maxFileSize}")
    private int maxFileSize;
    
    
    /**
     * @param userCtx
     * @return
     */
    @GetMapping
    public ModelAndView board(@AuthenticationPrincipal UserContext userCtx) {
        log.info("[Board]board=================>{}", userCtx);
        return new ModelAndView("blink/board/board");
    }
    
    
    /**
     * @param dataTablesRequest
     * @return
     */
    @PostMapping("findBoard")
    public ResponseEntity<?> findBoard(@RequestBody final DataTablesRequest dataTablesRequest) {
        // Board List Domain
        BoardDomain boardDomain = new BoardDomain();
        boardDomain.setBbsTypeCd(AppConst.BBS_TYPE_BOARD);
        
        // Columns Info Re-Arrange
        List<Column> columns = dataTablesRequest.getColumns();
        
        columns.forEach( col -> {
            
            if (StringUtils.equals(col.getData(), "searchType")) {
                boardDomain.setSearchType(col.getSearch().getValue());
            } else if (StringUtils.equals(col.getData(), "searchKeyword")) {
                boardDomain.setSearchKeyword(col.getSearch().getValue());
            } 
            
        });
        
        boardDomain.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
        DataTablesResponse<?> dataTablesResponse = boardService.findBoard(boardDomain);
        return ResponseEntity.ok(dataTablesResponse);
        
    }
    
    
    /**
     * @param userCtx
     * @return
     */
    @GetMapping("writeBoard")
    public ModelAndView writeBoard(@AuthenticationPrincipal UserContext userCtx) {
        log.info("[Board]writeBoard=================>{}", userCtx);
        ModelAndView mav = new ModelAndView("blink/board/boardDetail");
        mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_WRITE);
        mav.addObject("maxFileSize", maxFileSize);
        return mav;
    }
    
    
    /**
     * @param boardDomain
     * @return
     */
    @PostMapping(value="writeBoard", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> writeBoard(@ModelAttribute final BoardDomain boardDomain) {
        long fileSize = boardDomain.getAttachFile().getSize();
        log.info("[UPLOAD]fileSize|maxFileSize=========>{} > {}", fileSize, maxFileSize);
        if (fileSize > maxFileSize) {
            throw new CommonException(messageUtil.getMessage("app.board.notice.m001"), ErrorCode.INTERNAL_SERVER_ERROR);
        }
        boardDomain.setBbsTypeCd(AppConst.BBS_TYPE_BOARD);
        RestResponse restResponse = boardService.registerBoard(boardDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /** 
     * @param bbsId
     * @param bbsAuthor
     * @param model
     * @param request
     * @param userCtx
     * @param redirectAttributes
     * @return
     */
    @GetMapping("boardDetail")
    public ModelAndView boardDetail(@RequestParam(value = "bbsId", required = false) Integer bbsId, 
            @RequestParam(value = "bbsAuthor", required = false) String bbsAuthor, HttpServletRequest request,
            @AuthenticationPrincipal UserContext userCtx, RedirectAttributes redirectAttributes) {
        
        log.info("[Board]boardDetail========>{}", bbsId);
        log.info("@roles====================>{}", userCtx.getAuthorities());
        log.info("@username=================>{}", userCtx.getUsername());
        log.info("@isAdmin==================>{}", request.isUserInRole("ROLE_ADMIN"));
        log.info("@isUser===================>{}", request.isUserInRole("ROLE_USER"));
        
        ModelAndView mav = new ModelAndView("blink/board/boardDetail");
        if (bbsId == null || StringUtils.isBlank(bbsAuthor)) {
            redirectAttributes.addFlashAttribute(AppConst.RETURN_MESSAGE, messageUtil.getMessage("app.board.notice.m028"));
            RedirectView view = new RedirectView("/board", true);
            view.setExposeModelAttributes(false);
            return new ModelAndView(view);
        }
        
        // if user is the thread owner or admin then he has the right to edit
        if (StringUtils.equals(bbsAuthor, userCtx.getUsername()) ) {
            mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_UPDATE);
        } else if (request.isUserInRole(AppConst.ROLE_ADMIN)) {
            mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_UPDATE);
            // add hit count
            boardService.increaseHitCountById(bbsId);
        } else {
            mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_VIEW);
            // add hit count
            boardService.increaseHitCountById(bbsId);
        }
        
        mav.addObject("maxFileSize", maxFileSize);
        mav.addObject("bbsId", bbsId);
        mav.addObject("bbsAuthor", bbsAuthor);
        
        return mav;
    }
    
    
    /**
     * @param boardDomain
     * @return
     */
    @PostMapping("findBoardDetail")
    public ResponseEntity<?> findBoardDetail(@RequestBody final BoardDomain boardDomain) {
        boardDomain.setBbsTypeCd(AppConst.BBS_TYPE_BOARD);
        return ResponseEntity.ok(boardService.findBoardDetail(boardDomain));
    }
    
    
    /** 
     * @param boardDomain
     * @return
     */
    @PostMapping(value="updateBoard", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBoard(@ModelAttribute final BoardDomain boardDomain) {
        MultipartFile attachFile = boardDomain.getAttachFile();
        log.info("[FILE]===========>{}", attachFile.isEmpty());
        RestResponse restResponse = boardService.updateBoard(boardDomain);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /** 
     * @param bbsId
     * @return
     */
    @GetMapping("deleteBoard/{bbsId}")
    public ResponseEntity<?> deleteBoard(@PathVariable final Integer bbsId) {
        RestResponse restResponse = boardService.deleteBoard(bbsId);
        return ResponseEntity.ok(restResponse);
    }
    
    
    /** 
     * @param response
     * @param originFileNm
     * @param storeFileNm
     */
   @PostMapping(value="downloadBoardAtcFile")
   public void downloadBoardAtcFile(HttpServletResponse response, @RequestParam("originFileNm") String originFileNm, @RequestParam("storeFileNm") String storeFileNm) {
       log.info("[DOWN]downloadBoardAtcFile===========> originFileNm : [{}], storeFileNm : [{}]", originFileNm, storeFileNm);
       boardService.downloadAtcFile(response, servletContext, originFileNm, storeFileNm);
   }
   
    
   /** 
    * @param userCtx
    * @return
    */
   @GetMapping("notice")
   public ModelAndView notice(@AuthenticationPrincipal UserContext userCtx) {
       log.info("[Board]notice=================>{}", userCtx);
       return new ModelAndView("blink/board/notice");
   }
   
   
   /** 
    * @param dataTablesRequest
    * @return
    */
   @PostMapping("notice/findNotice")
   public ResponseEntity<?> findNotice(@RequestBody final DataTablesRequest dataTablesRequest) {
       // Board List Domain
       BoardDomain boardDomain = new BoardDomain();
       boardDomain.setBbsTypeCd(AppConst.BBS_TYPE_NOTICE);
       
       // Columns Info Re-Arrange
       List<Column> columns = dataTablesRequest.getColumns();
       
       columns.forEach( col -> {
           
           if (StringUtils.equals(col.getData(), "searchType")) {
               boardDomain.setSearchType(col.getSearch().getValue());
           } else if (StringUtils.equals(col.getData(), "searchKeyword")) {
               boardDomain.setSearchKeyword(col.getSearch().getValue());
           } 
           
       });
       
       boardDomain.setDataTablesRequest(dataTablesUtil.mapPostgreSQL(dataTablesRequest));
       DataTablesResponse<?> dataTablesResponse = boardService.findBoard(boardDomain);
       return ResponseEntity.ok(dataTablesResponse);
       
   }
   
   
   /**
    * @param userCtx
    * @return
    */
   @GetMapping("notice/writeNotice")
   public ModelAndView writeNotice(@AuthenticationPrincipal UserContext userCtx) {
       log.info("[Board]writeNotice=================>{}", userCtx);
       ModelAndView mav = new ModelAndView("blink/board/noticeDetail");
       mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_WRITE);
       mav.addObject("maxFileSize", maxFileSize);
       return mav;
   }
   
   
   /** 
    * @param boardDomain
    * @return
    */
   @PostMapping(value="notice/writeNotice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<?> writeNotice(@ModelAttribute final BoardDomain boardDomain) {
       long fileSize = boardDomain.getAttachFile().getSize();
       log.info("[UPLOAD]fileSize|maxFileSize=========>{} > {}", fileSize, maxFileSize);
       if (fileSize > maxFileSize) {
           throw new CommonException(messageUtil.getMessage("app.board.notice.m001"), ErrorCode.INTERNAL_SERVER_ERROR);
       }
       boardDomain.setBbsTypeCd(AppConst.BBS_TYPE_NOTICE);
       RestResponse restResponse = boardService.registerBoard(boardDomain);
       return ResponseEntity.ok(restResponse);
   }
   
   
   /** 
    * @param bbsId
    * @param bbsAuthor
    * @param model
    * @param request
    * @param userCtx
    * @param redirectAttributes
    * @return
    */
   @GetMapping("notice/noticeDetail")
   public ModelAndView noticeDetail(@RequestParam(value = "bbsId", required = false) Integer bbsId, 
           @RequestParam(value = "bbsAuthor", required = false) String bbsAuthor, HttpServletRequest request,
           @AuthenticationPrincipal UserContext userCtx, RedirectAttributes redirectAttributes) {
       
       log.info("[Board]noticeDetail=======>{}", bbsId);
       log.info("@roles====================>{}", userCtx.getAuthorities());
       log.info("@username=================>{}", userCtx.getUsername());
       log.info("@isAdmin==================>{}", request.isUserInRole("ROLE_ADMIN"));
       log.info("@isUser===================>{}", request.isUserInRole("ROLE_USER"));
       
       ModelAndView mav = new ModelAndView("blink/board/noticeDetail");
       if (bbsId == null || StringUtils.isBlank(bbsAuthor)) {
           redirectAttributes.addFlashAttribute(AppConst.RETURN_MESSAGE, messageUtil.getMessage("app.board.notice.m028"));
           RedirectView view = new RedirectView("/board/notice", true);
           view.setExposeModelAttributes(false);
           return new ModelAndView(view);
       }
       
       // if user is the thread owner or admin then he has the right to edit
       if (StringUtils.equals(bbsAuthor, userCtx.getUsername()) ) {
           mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_UPDATE);
       } else if (request.isUserInRole(AppConst.ROLE_ADMIN)) {
           mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_UPDATE);
           boardService.increaseHitCountById(bbsId);
       } else {
           mav.addObject(AppConst.BBS_DETAIL_MODE, AppConst.BBS_DETAIL_VIEW);
           boardService.increaseHitCountById(bbsId);
       }
       
       mav.addObject("maxFileSize", maxFileSize);
       mav.addObject("bbsId", bbsId);
       mav.addObject("bbsAuthor", bbsAuthor);
       
       return mav;
   }
   
   
   /**
    * @param user
    * @return
    */
   @PostMapping("notice/findNoticeDetail")
   public ResponseEntity<?> findNoticeDetail(@RequestBody final BoardDomain boardDomain) {
       boardDomain.setBbsTypeCd(AppConst.BBS_TYPE_NOTICE);
       return ResponseEntity.ok(boardService.findBoardDetail(boardDomain));
   }
   
   
   /**
    * @param boardDomain
    * @return
    */
   @PostMapping(value="notice/updateNotice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<?> updateNotice(@ModelAttribute final BoardDomain boardDomain) {
       RestResponse restResponse = boardService.updateBoard(boardDomain);
       return ResponseEntity.ok(restResponse);
   }
   
   
   /**
    * @param bbsId
    * @return
    */
   @GetMapping("notice/deleteNotice/{bbsId}")
   public ResponseEntity<?> deleteNotice(@PathVariable final Integer bbsId) {
       RestResponse restResponse = boardService.deleteBoard(bbsId);
       return ResponseEntity.ok(restResponse);
   }
   
   
   /**
    * @param response
    * @param originFileNm
    * @param storeFileNm
    */
  @PostMapping(value="notice/downloadNoticeAtcFile")
  public void downloadNoticeAtcFile(HttpServletResponse response, @RequestParam("originFileNm") String originFileNm, @RequestParam("storeFileNm") String storeFileNm) {
      log.info("[DOWN]downloadNoticeAtcFile===========> originFileNm : [{}], storeFileNm : [{}]", originFileNm, storeFileNm);
      boardService.downloadAtcFile(response, servletContext, originFileNm, storeFileNm);
  }
    
    
}
