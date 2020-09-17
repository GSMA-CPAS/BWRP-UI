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
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
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
import com.kt.blink.biz.dch.tap.domain.TapFileDomain;

import net.sf.jxls.exception.ParsePropertyException;

/**
 * TAP FILE Excel View
 */
public class TapFileExcelView extends AbstractXlsxStreamingView {

    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = Integer.parseInt((String) model.get("listPrcsn"));
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<TapFileDomain> results = (List<TapFileDomain>) model.get("results");
        
//        if (!results.isEmpty()) {
            this.generateExcelWorkbook(results, workbook, filename, listPrcsn);
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
    public void generateExcelWorkbook(List<TapFileDomain> tapFileDomains, Workbook workbook, String filename, Integer precison) {
        
        try {
            
            Row row = null;
            Sheet worksheet = workbook.createSheet(filename);
            CreationHelper createHelper = workbook .getCreationHelper();
            
            String decimalPrcsnFormat = AppConst.DECIMAL_FORMAT2;
            
            if (precison.equals(4)) {
                decimalPrcsnFormat = AppConst.DECIMAL_FORMAT4;
            } 
            
            /**
             * Cell Format Styles
             */
            CellStyle numberStyle = workbook .createCellStyle();
            numberStyle.setDataFormat(createHelper.createDataFormat().getFormat(AppConst.NUMBER_FORMAT));
            
            CellStyle decimalStyle = workbook .createCellStyle();
            decimalStyle.setDataFormat(createHelper.createDataFormat().getFormat(decimalPrcsnFormat));
            
            CellStyle leftAlignStyle = workbook .createCellStyle();
            leftAlignStyle.setAlignment(HorizontalAlignment.LEFT);
            
            CellStyle centerAlignStyle = workbook .createCellStyle();
            centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
            
            CellStyle centerDateStyle = workbook .createCellStyle();
            centerDateStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-mm-dd"));
            centerDateStyle.setAlignment(HorizontalAlignment.CENTER);
            
            CellStyle rightAlignStyle = workbook .createCellStyle();
            rightAlignStyle.setAlignment(HorizontalAlignment.RIGHT);
            
            Font titleFont = workbook.createFont();
            titleFont.setFontHeightInPoints((short)15);
            //titleFont.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
            titleFont.setFontName(HSSFFont.FONT_ARIAL);
            titleFont.setBold(true);
            
            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setAlignment(HorizontalAlignment.LEFT);
            titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            //titleStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_50_PERCENT.getIndex());
            //titleStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            titleStyle.setFont(titleFont);
            
            Font headerFont = workbook.createFont();
            headerFont.setFontHeightInPoints((short)11);
            //headerFont.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
            headerFont.setFontName(HSSFFont.FONT_ARIAL);
            headerFont.setBold(true);
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            //headerStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.ROYAL_BLUE.getIndex());
            //headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setFont(headerFont);
            
            CellStyle totalNumberStyle = workbook .createCellStyle();
            totalNumberStyle.setDataFormat(createHelper.createDataFormat().getFormat(AppConst.NUMBER_FORMAT));
            //totalNumberStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.TEAL.getIndex());
            //totalNumberStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalNumberStyle.setFont(headerFont);
            
            CellStyle totalDecimalStyle = workbook .createCellStyle();
            totalDecimalStyle.setDataFormat(createHelper.createDataFormat().getFormat(decimalPrcsnFormat));
            //totalDecimalStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.TEAL.getIndex());
            //totalDecimalStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalDecimalStyle.setFont(headerFont);
            
            // init row idx
            int rowIdx = 0;
            
            // header column width
            int columnIndex = 0;
            
            while (columnIndex < 11) {
                if(columnIndex == 0) {
                    worksheet.setColumnWidth(columnIndex, 7000);
                } else {
                    worksheet.setColumnWidth(columnIndex, 5000);
                }
                
                columnIndex++;
            }
            
            // title
            row = worksheet.createRow(rowIdx);
            Cell cell = row.createCell(0);
            cell.setCellValue("TAP Processing Result");
            cell.setCellStyle(titleStyle);
            
            // Merge title Columns (current row idx, from column idx, to colum idx)
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 17));
            
             
            // header naming
            row = worksheet.createRow(++rowIdx);
            
            cell = row.createCell(0);
            cell.setCellValue("File Name");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(1);
            cell.setCellValue("My Network");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(2);
            cell.setCellValue("Partner Network");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(3);
            cell.setCellValue("File Create Date");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(4);
            cell.setCellValue("File Process Date");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(5);
            cell.setCellValue("Tap Direction");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(6);
            cell.setCellValue("File Status");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(7);
            cell.setCellValue("Settle Month");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(8);
            cell.setCellValue("Total Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(9);
            cell.setCellValue("Success Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(10);
            cell.setCellValue("Error Records");
            cell.setCellStyle(headerStyle);
            
            /**
             * Create Row Cells Using Result Data
             * 
             */
            for (TapFileDomain tapFileDomain : tapFileDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.file name
                cell = row.createCell(0);
                cell.setCellValue(tapFileDomain.getInptFileNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.trmPlmnId
                cell = row.createCell(1);
                cell.setCellValue(tapFileDomain.getTrmPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.rcvPlmnId
                cell = row.createCell(2);
                cell.setCellValue(tapFileDomain.getRcvPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.file create date
                cell = row.createCell(3);
                cell.setCellValue(tapFileDomain.getFileCretDtVal());
                cell.setCellStyle(centerDateStyle);
                
                // 4.file processed date
                cell = row.createCell(4);
                cell.setCellValue(tapFileDomain.getTrtFnsDt());
                cell.setCellStyle(centerDateStyle);
                
                // 5.tapDirection
                cell = row.createCell(5);
                cell.setCellValue(tapFileDomain.getTapDirection());
                cell.setCellStyle(centerAlignStyle);
                
                // 6.fileTrtStatus
                cell = row.createCell(6);
                cell.setCellValue(tapFileDomain.getTrtSttusCd());
                cell.setCellStyle(centerAlignStyle);
                
                // 7.settle month
                cell = row.createCell(7);
                cell.setCellValue(tapFileDomain.getSetlMonth());
                cell.setCellStyle(centerAlignStyle);
                
                // 8.totalCdrCnt
                cell = row.createCell(8);
                cell.setCellValue(tapFileDomain.getTotCdrCnt());
                cell.setCellStyle(numberStyle);
                
                // 9.normalCdrCnt
                cell = row.createCell(9);
                cell.setCellValue(tapFileDomain.getCdrCnt());
                cell.setCellStyle(numberStyle);
                
                // 10.errorCdrCnt
                cell = row.createCell(10);
                cell.setCellValue(tapFileDomain.getErrCnt());
                cell.setCellStyle(numberStyle);
                
                
            }

            
            /**
             * Create Last Bottom Row Cells
             */
//            TapFileDomain firstTapRow = tapFileDomains.stream().findFirst().orElseGet(TapFileDomain::new);
//            
//            row = worksheet.createRow(++rowIdx);
//            
//            cell = row.createCell(0);
//            cell.setCellValue("TOTAL");
//            cell.setCellStyle(headerStyle);
//            
//            cell = row.createCell(8);
//            cell.setCellValue(firstTapRow.getSumTotCdrCnt());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(9);
//            cell.setCellValue(firstTapRow.getSumCdrCnt());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(10);
//            cell.setCellValue(firstTapRow.getSumErrCnt());
//            cell.setCellStyle(totalNumberStyle);
//            
//            // Merge total Columns (current row idx, from column idx, to colum idx)
//            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 7));
        
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
