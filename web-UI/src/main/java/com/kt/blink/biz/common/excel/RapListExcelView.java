package com.kt.blink.biz.common.excel;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsxStreamingView;

import com.kt.blink.biz.common.constant.AppConst;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.CommonUtil;
import com.kt.blink.biz.dch.tap.domain.RapDomain;

import lombok.extern.slf4j.Slf4j;
import net.sf.jxls.exception.ParsePropertyException;

/**
 * Invoice LIST Excel View
 */
@Slf4j
public class RapListExcelView extends AbstractXlsxStreamingView {

    
    private List<String> titles;
    private String cur;
    
    public RapListExcelView(List<String> title, String cur) {
        this.titles = title;
        this.cur = cur;
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = 0;
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<RapDomain> rapListDomains = (List<RapDomain>) model.get("results");
        
//        if (!rapListDomains.isEmpty()) {
            this.generateTapListExcel(rapListDomains, workbook, filename, listPrcsn);
//        }
        
        response.setContentType("application/download;charset=utf-8");
        response.setHeader("Content-Disposition", "attachment; filename=" + attachFileName + ".xlsx");
        response.setHeader("Content-Transfer-Encoding", "binary");
        
        
    }
    
    
    /**
     * create TAP LIST Excel
     * 
     * @param tapListDomains
     * @param workbook
     * @param filename
     */
    public void generateTapListExcel(List<RapDomain> rapListDomains, Workbook workbook, String filename, Integer precison) {
        
        try {
            
            Row row = null;
            Sheet worksheet = workbook.createSheet(filename);
            CreationHelper createHelper = workbook .getCreationHelper();
            
//            String decimalPrcsnFormat = AppConst.DECIMAL_FORMAT2;
//            
//            if (precison.equals(4)) {
//                decimalPrcsnFormat = AppConst.DECIMAL_FORMAT4;
//            } 
            
            /**
             * Cell Format Styles
             */
            CellStyle numberStyle = workbook .createCellStyle();
            numberStyle.setDataFormat(createHelper.createDataFormat().getFormat(AppConst.NUMBER_FORMAT));
            
//            CellStyle decimalStyle = workbook .createCellStyle();
//            decimalStyle.setDataFormat(createHelper.createDataFormat().getFormat(decimalPrcsnFormat));
            
            CellStyle leftAlignStyle = workbook .createCellStyle();
            leftAlignStyle.setAlignment(HorizontalAlignment.LEFT);
            
            CellStyle centerAlignStyle = workbook .createCellStyle();
            centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
            
            CellStyle rightAlignStyle = workbook .createCellStyle();
            rightAlignStyle.setAlignment(HorizontalAlignment.RIGHT);
            
            Font titleFont = workbook.createFont();
            titleFont.setFontHeightInPoints((short)15);
//            titleFont.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
            titleFont.setFontName(HSSFFont.FONT_ARIAL);
            titleFont.setBold(true);
            
            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setAlignment(HorizontalAlignment.LEFT);
            titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            titleStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_50_PERCENT.getIndex());
            titleStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            titleStyle.setFont(titleFont);
            
            Font headerFont = workbook.createFont();
            headerFont.setFontHeightInPoints((short)11);
//            headerFont.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
            headerFont.setFontName(HSSFFont.FONT_ARIAL);
            headerFont.setBold(true);
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
//            headerStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.ROYAL_BLUE.getIndex());
//            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setFont(headerFont);
            
            CellStyle totalNumberStyle = workbook .createCellStyle();
//            totalNumberStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.TEAL.getIndex());
//            totalNumberStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalNumberStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalNumberStyle.setFont(headerFont);
            
            CellStyle totalDecimalStyle = workbook .createCellStyle();
//            totalDecimalStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.TEAL.getIndex());
//            totalDecimalStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalNumberStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalDecimalStyle.setFont(headerFont);
            
            int idx = 10;
            // init row idx
            int rowIdx = 0;
            
            // header column width
            int columnIndex = 0;
            
            while (columnIndex < idx) {
                worksheet.setColumnWidth(columnIndex, 5000);
                columnIndex++;
            }
            
            // title
            row = worksheet.createRow(rowIdx);
            Cell cell = row.createCell(0);
            cell.setCellValue("Rap List");
            cell.setCellStyle(titleStyle);
            
            // Merge title Columns (current row idx, from column idx, to colum idx)
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, idx));

            // Currency
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue("Currency : " + cur);
            cell.setCellStyle(totalNumberStyle);
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, idx));
             
            // header naming
            row = worksheet.createRow(++rowIdx);
            
            int tidx=0;
            for(String title : titles) {
                title = StringUtils.replace(title, "<br>", " ");
                cell = row.createCell(tidx++);
                cell.setCellValue(title);
                cell.setCellStyle(headerStyle);
            }
                        
            /**
             * Create Row Cells Using Result Data
             * 
             */
            idx = 0;
            for (RapDomain invDomain : rapListDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.fileNm
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getFileNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.fileCretDtValView
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getFileCretDtValView());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.trmPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getTrmPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.rcvPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getRcvPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 4.recdNo
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getRecdNo());
                cell.setCellStyle(centerAlignStyle);
                
                // 5.imsiId
//                cell = row.createCell(5);
//                cell.setCellValue(invDomain.getImsiId());
//                cell.setCellStyle(centerAlignStyle);
                
                // 6.callTypeIdNm
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getCallTypeIdNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 7.calldNo
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getCalldNo());
                cell.setCellStyle(centerAlignStyle);
                
                // 8.duration
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getDuration());
                cell.setCellStyle(rightAlignStyle);
                
                // 9.volume
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getVolume());
                cell.setCellStyle(rightAlignStyle);

                // 9.errCd
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getErrCd());
                cell.setCellStyle(centerAlignStyle);
                

                // 9.errCdNm
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getErrCdNm());
                cell.setCellStyle(centerAlignStyle);
                
                idx= 0;
            }
            
        
        } catch (ParsePropertyException ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * create download filename
     * 
     * @param request
     * @param filename
     * @return
     */
    public String getExcelFileName(HttpServletRequest request, String filename) {
        String browser = request.getHeader("User-Agent");
        String attachFilename = StringUtils.EMPTY;
        
        try {
            
            if (browser.contains("MSIE") || browser.contains("Trident") || browser.contains("Chrome")) {
                attachFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
            } else {
                attachFilename = new String(filename.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
            }
            
            return attachFilename + "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(AppConst.LOG_DATE_FORMAT));
            
        } catch (UnsupportedEncodingException ex) {
            throw new CommonException(CommonUtil.COMN_UTIL_ERR, ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
    }
    
    
    
}
