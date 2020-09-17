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
import com.kt.blink.biz.fch.invoice.domain.TapFileSumDomain;

import lombok.extern.slf4j.Slf4j;
import net.sf.jxls.exception.ParsePropertyException;

/**
 * Invoice LIST Excel View
 */
@Slf4j
public class InvoiceListExcelView extends AbstractXlsxStreamingView {

    
    private List<String> titles;
    private String cur;
    
    public InvoiceListExcelView(List<String> title, String cur) {
        this.titles = title;
        this.cur = cur;
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = Integer.parseInt((String) model.get("listPrcsn"));
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<TapFileSumDomain> invListDomains = (List<TapFileSumDomain>) model.get("results");
        
//        if (!invListDomains.isEmpty()) {
            this.generateTapListExcel(invListDomains, workbook, filename, listPrcsn);
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
    public void generateTapListExcel(List<TapFileSumDomain> invListDomains, Workbook workbook, String filename, Integer precison) {
        
        try {
            
            Row row = null;
            Sheet worksheet = workbook.createSheet(filename);
            CreationHelper createHelper = workbook .getCreationHelper();
            
            /**
             * Cell Format Styles
             */
            CellStyle numberStyle = workbook .createCellStyle();
            numberStyle.setDataFormat(createHelper.createDataFormat().getFormat(AppConst.NUMBER_FORMAT));
                        
            CellStyle leftAlignStyle = workbook .createCellStyle();
            leftAlignStyle.setAlignment(HorizontalAlignment.LEFT);
            
            CellStyle centerAlignStyle = workbook .createCellStyle();
            centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
            
            CellStyle rightAlignStyle = workbook .createCellStyle();
            rightAlignStyle.setAlignment(HorizontalAlignment.RIGHT);
            
            Font titleFont = workbook.createFont();
            titleFont.setFontHeightInPoints((short)15);
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
            headerFont.setBold(true);
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFont(headerFont);
            
            CellStyle totalNumberStyle = workbook .createCellStyle();
            totalNumberStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalNumberStyle.setFont(headerFont);
            
            CellStyle totalDecimalStyle = workbook .createCellStyle();
            totalDecimalStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalDecimalStyle.setFont(headerFont);
            
            // init row idx
            int rowIdx = 0;
            
            // header column width
            int columnIndex = 0;
            
            while (columnIndex < 10) {
                worksheet.setColumnWidth(columnIndex, 5000);
                columnIndex++;
            }
            
            // title
            row = worksheet.createRow(rowIdx);
            Cell cell = row.createCell(0);
            cell.setCellValue("Invoice List");
            cell.setCellStyle(titleStyle);
            
            // Merge title Columns (current row idx, from column idx, to colum idx)
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 9));
            
            // Currency
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue("Currency : " + cur);
            cell.setCellStyle(totalNumberStyle);
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 9));
             
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
            int idx = 0;
            for (TapFileSumDomain invDomain : invListDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.fileCretDateVal
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getSetlMonthView());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.trmPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getIssueMonth());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.rcvPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getTrmPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.tapDirection
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getRcvPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 4.tapSeq
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getKindCdNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 5.totalRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getInvocDirectCdNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 6.totalCalcAmt
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getDocuNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 7.mocVoRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getStatusCdNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 8.mocVoUseQnt
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getRevenue());
                cell.setCellStyle(rightAlignStyle);
                
                // 9.mocVoCalcAmt
                cell = row.createCell(idx++);
                cell.setCellValue(invDomain.getExpense());
                cell.setCellStyle(rightAlignStyle);
                
                idx = 0;
            }
            
            
            /**
             * Create Last Bottom Row Cells
             */
//            TapFileSumDomain firstTapRow = invListDomains.stream().findFirst().orElseGet(TapFileSumDomain::new);
//            
//            row = worksheet.createRow(++rowIdx);
//            
//            cell = row.createCell(0);
//            cell.setCellValue("TOTAL");
//            cell.setCellStyle(headerStyle);
//            
//            cell = row.createCell(4);
//            cell.setCellValue("Revenue");
//            cell.setCellStyle(totalNumberStyle);
//            cell = row.createCell(5);
//            cell.setCellValue(firstTapRow.getRevenueSum());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(6);
//            cell.setCellValue("Expense");
//            cell.setCellStyle(totalNumberStyle);
//            cell = row.createCell(7);
//            cell.setCellValue(firstTapRow.getExpenseSum());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(8);
//            cell.setCellValue("Profit");
//            cell.setCellStyle(totalNumberStyle);
//            cell = row.createCell(9);
//            cell.setCellValue(firstTapRow.getProfitSum());
//            cell.setCellStyle(totalNumberStyle);
//            
//            
//            // Merge total Columns (current row idx, from column idx, to colum idx)
//            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 3));
        
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
