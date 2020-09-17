package com.kt.blink.biz.common.excel;

import java.io.IOException;
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
import com.kt.blink.biz.dch.tap.domain.TapDetailDomain;

import net.sf.jxls.exception.ParsePropertyException;

/**
 * TAP DETAIL Excel View
 */
public class TapDetailExcelView extends AbstractXlsxStreamingView {

    private String cur;
    
    public TapDetailExcelView(String cur) {
        this.cur = cur;
    }
    
    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = Integer.parseInt((String) model.get("listPrcsn"));
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<TapDetailDomain> results = (List<TapDetailDomain>) model.get("results");
//        if (!results.isEmpty()) {
            this.generateExcelWorkbook(results, workbook, filename, listPrcsn);
//        }
        
        response.setContentType("application/download;charset=utf-8");
        response.setHeader("Content-Disposition", "attachment; filename=" + attachFileName + ".xlsx");
        response.setHeader("Content-Transfer-Encoding", "binary");
        
        
    }
    
    
    /**
     * create TAP DETIL Excel
     * 
     * @param tapDetailDomains
     * @param workbook
     * @param filename
     * @throws IOException
     */
    public void generateExcelWorkbook(List<TapDetailDomain> tapDetailDomains, Workbook workbook, String filename, Integer precison) {
        
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
            
            while (columnIndex < 13) {
                
               if(columnIndex == 0) {
                    worksheet.setColumnWidth(columnIndex, 6000);
                } else if (columnIndex == 6) { // imsi
                    worksheet.setColumnWidth(columnIndex, 0);
                } else if(columnIndex == 10) {
                    worksheet.setColumnWidth(columnIndex, 3000);
                } else {
                    worksheet.setColumnWidth(columnIndex, 5000);
                }
                columnIndex++;
            }
             
            // title
            row = worksheet.createRow(rowIdx);
            Cell cell = row.createCell(0);
            cell.setCellValue("TAP DETAIL");
            cell.setCellStyle(titleStyle);
            
            // Merge title Columns (current row idx, from column idx, to colum idx)
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 12));

            // Currency
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue("Currncy : " + cur);
            cell.setCellStyle(totalNumberStyle);
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 12));
             
            // header naming
            row = worksheet.createRow(++rowIdx);
            
            cell = row.createCell(0);
            cell.setCellValue("File Name");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(1);
            cell.setCellValue("Start Time");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(2);
            cell.setCellValue("My Network");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(3);
            cell.setCellValue("Partner Network");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(4);
            cell.setCellValue("Tap Direction");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(5);
            cell.setCellValue("Recd No");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(6);
            cell.setCellValue("IMSI");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(7);
            cell.setCellValue("Call Type");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(8);
            cell.setCellValue("Called Number");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(9);
            cell.setCellValue("Volumn");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(10);
            cell.setCellValue("Unit");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(11);
            cell.setCellValue("Charge");
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(12);
            cell.setCellValue("Sett Charge");
            cell.setCellStyle(headerStyle);
            
            /**
             * Create Row Cells Using Result Data
             * 
             */
            for (TapDetailDomain tapDetailDomain : tapDetailDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.roamFileNm
                cell = row.createCell(0);
                cell.setCellValue(tapDetailDomain.getRoamFileNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.localTime
                cell = row.createCell(1);
                cell.setCellValue(tapDetailDomain.getLocalTime());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.hpmn
                cell = row.createCell(2);
                cell.setCellValue(tapDetailDomain.getHpmn());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.vpmn
                cell = row.createCell(3);
                cell.setCellValue(tapDetailDomain.getVpmn());
                cell.setCellStyle(centerAlignStyle);
                
                // 4.tapDirection
                cell = row.createCell(4);
                cell.setCellValue(tapDetailDomain.getTapDirection());
                cell.setCellStyle(centerAlignStyle);
                
                // 5.recdNo
                cell = row.createCell(5);
                cell.setCellValue(tapDetailDomain.getRecdNo());
                cell.setCellStyle(centerAlignStyle);
                
                // 6.imsiId
                cell = row.createCell(6);
                cell.setCellValue(StringUtils.EMPTY);
                cell.setCellStyle(centerAlignStyle);
                
                // 7.callType
                cell = row.createCell(7);
                cell.setCellValue(tapDetailDomain.getCallType());
                cell.setCellStyle(centerAlignStyle);
                
                
                // 8.calledNo
                cell = row.createCell(8);
                cell.setCellValue(tapDetailDomain.getCalledNo());
                cell.setCellStyle(centerAlignStyle);
                
                // 9.volumn
                cell = row.createCell(9);
                cell.setCellValue(tapDetailDomain.getVolumn());
                cell.setCellStyle(numberStyle);
                
                // 10.unit
                cell = row.createCell(10);
                cell.setCellValue(tapDetailDomain.getUnit());
                cell.setCellStyle(centerAlignStyle);
                
                // 11.charge
                cell = row.createCell(11);
                cell.setCellValue(tapDetailDomain.getCharge());
                cell.setCellStyle(decimalStyle);
                
                // 12.settCharge
                cell = row.createCell(12);
                cell.setCellValue(tapDetailDomain.getSetlCharge());
                cell.setCellStyle(decimalStyle);
                
            }
            
            
            /**
             * Create Last Bottom Row Cells
             */
//            TapDetailDomain firstTapRow = tapDetailDomains.stream().findFirst().orElseGet(TapDetailDomain::new);
//            
//            row = worksheet.createRow(++rowIdx);
//            cell = row.createCell(0);
//            cell.setCellValue("TOTAL");
//            cell.setCellStyle(headerStyle);
//            
//            cell = row.createCell(11);
//            cell.setCellValue(firstTapRow.getSumCharge());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            cell = row.createCell(12);
//            cell.setCellValue(firstTapRow.getSumSetlCharge());
//            cell.setCellStyle(totalDecimalStyle);
//            
//            // Merge total Columns (current row idx, from column idx, to colum idx)
//            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 10));
            
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
