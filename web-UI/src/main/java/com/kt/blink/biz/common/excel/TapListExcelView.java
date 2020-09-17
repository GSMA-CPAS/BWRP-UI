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
import com.kt.blink.biz.dch.tap.domain.TapListDomain;

import net.sf.jxls.exception.ParsePropertyException;

/**
 * TAP LIST Excel View
 */
public class TapListExcelView extends AbstractXlsxStreamingView {

    private String cur;
    
    public TapListExcelView(String cur) {
        this.cur = cur;
    }
    
    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = Integer.parseInt((String) model.get("listPrcsn"));
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<TapListDomain> results = (List<TapListDomain>) model.get("results");
        
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
    public void generateExcelWorkbook(List<TapListDomain> tapListDomains, Workbook workbook, String filename, Integer precison) {
        
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
            totalNumberStyle.setAlignment(HorizontalAlignment.RIGHT);
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
            
            while (columnIndex < 18) {
                worksheet.setColumnWidth(columnIndex, 5000);
                columnIndex++;
            }
            
            // title
            row = worksheet.createRow(rowIdx);
            Cell cell = row.createCell(0);
            cell.setCellValue("TAP List");
            cell.setCellStyle(titleStyle);
            
            // Merge title Columns (current row idx, from column idx, to colum idx)
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 17));

            // Currency
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue("Currency : " + cur);
            cell.setCellStyle(totalNumberStyle);
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 17));
             
             
            // header naming
            row = worksheet.createRow(++rowIdx);
            
            cell = row.createCell(0);
            cell.setCellValue("Date");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(1);
            cell.setCellValue("My Network");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(2);
            cell.setCellValue("Partner Network");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(3);
            cell.setCellValue("Tap Direction");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(4);
            cell.setCellValue("Sequence");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(5);
            cell.setCellValue("Total Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(6);
            cell.setCellValue("Total Gross");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(7);
            cell.setCellValue("MOC Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(8);
            cell.setCellValue("MOC Duration");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(9);
            cell.setCellValue("MOC Gross");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(10);
            cell.setCellValue("MTC Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(11);
            cell.setCellValue("MTC Duration");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(12);
            cell.setCellValue("MTC Gross");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(13);
            cell.setCellValue("Data Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(14);
            cell.setCellValue("Data Duration");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(15);
            cell.setCellValue("Data Gross");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(16);
            cell.setCellValue("SMS Records");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(17);
            cell.setCellValue("SMS Gross");
            cell.setCellStyle(headerStyle);
            
            /**
             * Create Row Cells Using Result Data
             * 
             */
            for (TapListDomain tapListDomain : tapListDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.fileCretDateVal
                cell = row.createCell(0);
                cell.setCellValue(tapListDomain.getFileCretDateVal());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.trmPlmnId
                cell = row.createCell(1);
                cell.setCellValue(tapListDomain.getTrmPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.rcvPlmnId
                cell = row.createCell(2);
                cell.setCellValue(tapListDomain.getRcvPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.tapDirection
                cell = row.createCell(3);
                cell.setCellValue(tapListDomain.getTapDirection());
                cell.setCellStyle(centerAlignStyle);
                
                // 4.tapSeq
                cell = row.createCell(4);
                cell.setCellValue(tapListDomain.getTapSeq());
                cell.setCellStyle(centerAlignStyle);
                
                // 5.totalRecdCnt
                cell = row.createCell(5);
                cell.setCellValue(tapListDomain.getTotalRecdCnt());
                cell.setCellStyle(numberStyle);
                
                // 6.totalCalcAmt
                cell = row.createCell(6);
                cell.setCellValue(tapListDomain.getTotalCalcAmt());
                cell.setCellStyle(decimalStyle);
                
                // 7.mocVoRecdCnt
                cell = row.createCell(7);
                cell.setCellValue(tapListDomain.getMocVoRecdCnt());
                cell.setCellStyle(numberStyle);
                
                // 8.mocVoUseQnt
                cell = row.createCell(8);
                cell.setCellValue(tapListDomain.getMocVoUseQnt());
                cell.setCellStyle(numberStyle);
                
                // 9.mocVoCalcAmt
                cell = row.createCell(9);
                cell.setCellValue(tapListDomain.getMocVoCalcAmt());
                cell.setCellStyle(decimalStyle);
                
                // 10.mtcVoRecdCnt
                cell = row.createCell(10);
                cell.setCellValue(tapListDomain.getMtcVoRecdCnt());
                cell.setCellStyle(numberStyle);
                
                // 11.mtcVoUseQnt
                cell = row.createCell(11);
                cell.setCellValue(tapListDomain.getMtcVoUseQnt());
                cell.setCellStyle(numberStyle);
                
                // 12.mtcVoCalcAmt
                cell = row.createCell(12);
                cell.setCellValue(tapListDomain.getMtcVoCalcAmt());
                cell.setCellStyle(decimalStyle);
                
                // 13.dataRecdCnt
                cell = row.createCell(13);
                cell.setCellValue(tapListDomain.getDataRecdCnt());
                cell.setCellStyle(numberStyle);
                
                // 14.dataUseQnt
                cell = row.createCell(14);
                cell.setCellValue(tapListDomain.getDataUseQnt());
                cell.setCellStyle(numberStyle);
                
                // 15.dataCalcAmt
                cell = row.createCell(15);
                cell.setCellValue(tapListDomain.getDataCalcAmt());
                cell.setCellStyle(decimalStyle);
                
                
                // 16.smsRecdCnt
                cell = row.createCell(16);
                cell.setCellValue(tapListDomain.getSmsRecdCnt());
                cell.setCellStyle(numberStyle);
                
                // 17.smsCalcAmt
                cell = row.createCell(17);
                cell.setCellValue(tapListDomain.getSmsCalcAmt());
                cell.setCellStyle(decimalStyle);
                
            }
            
            
            /**
             * Create Last Bottom Row Cells
             */
//            TapListDomain firstTapRow = tapListDomains.stream().findFirst().orElseGet(TapListDomain::new);
//            
//            row = worksheet.createRow(++rowIdx);
//            
//            cell = row.createCell(0);
//            cell.setCellValue("TOTAL");
//            cell.setCellStyle(headerStyle);
//            
//            cell = row.createCell(5);
//            cell.setCellValue(firstTapRow.getSumRecdTotal());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(6);
//            cell.setCellValue(firstTapRow.getSumAmtTotal());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            cell = row.createCell(7);
//            cell.setCellValue(firstTapRow.getSumRecdMoc());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(8);
//            cell.setCellValue(firstTapRow.getSumUseMoc());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(9);
//            cell.setCellValue(firstTapRow.getSumAmtMoc());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            cell = row.createCell(10);
//            cell.setCellValue(firstTapRow.getSumRecdMtc());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(11);
//            cell.setCellValue(firstTapRow.getSumUseMtc());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(12);
//            cell.setCellValue(firstTapRow.getSumAmtMtc());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            cell = row.createCell(13);
//            cell.setCellValue(firstTapRow.getSumRecdData());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(14);
//            cell.setCellValue(firstTapRow.getSumUseData());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(15);
//            cell.setCellValue(firstTapRow.getSumAmtData());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            cell = row.createCell(16);
//            cell.setCellValue(firstTapRow.getSumRecdSms());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(17);
//            cell.setCellValue(firstTapRow.getSumAmtSms());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            // Merge total Columns (current row idx, from column idx, to colum idx)
//            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 4));
        
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
