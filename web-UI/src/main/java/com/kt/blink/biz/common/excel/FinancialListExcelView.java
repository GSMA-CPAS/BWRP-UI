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
import com.kt.blink.biz.fch.finance.domain.FinanceDomain;

import lombok.extern.slf4j.Slf4j;
import net.sf.jxls.exception.ParsePropertyException;

/**
 * Invoice LIST Excel View
 */
@Slf4j
public class FinancialListExcelView extends AbstractXlsxStreamingView {

    
    private Map<String, String> titles;
    private String cur;
    
    public FinancialListExcelView(Map<String, String> title, String cur) {
        this.titles = title;
        this.cur = cur;
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = Integer.parseInt((String) model.get("listPrcsn"));
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<FinanceDomain> finListDomains = (List<FinanceDomain>) model.get("results");
        
//        if (!finListDomains.isEmpty()) {
            this.generateTapListExcel(finListDomains, workbook, filename, listPrcsn);
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
    public void generateTapListExcel(List<FinanceDomain> finListDomains, Workbook workbook, String filename, Integer precison) {
        
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
            headerFont.setFontName(HSSFFont.FONT_ARIAL);
            headerFont.setBold(true);
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFont(headerFont);
            
            CellStyle totalNumberStyle = workbook .createCellStyle();
            totalNumberStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalNumberStyle.setFont(headerFont);
            
            CellStyle totalDecimalStyle = workbook .createCellStyle();
            totalNumberStyle.setAlignment(HorizontalAlignment.RIGHT);
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
            cell.setCellValue("Finances");
            cell.setCellStyle(titleStyle);
            
            // Merge title Columns (current row idx, from column idx, to colum idx)
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 8));

            // Currency
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue("Currency : " + cur);
            cell.setCellStyle(totalNumberStyle);
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx,rowIdx, 0, 8));
             
             
            // header naming
            row = worksheet.createRow(++rowIdx);
            
            cell = row.createCell(0);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(1);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(2);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(3);
            cell.setCellValue(titles.get("range"));
            cell.setCellStyle(headerStyle);
            
            String overDay = "";
            if(!finListDomains.isEmpty()) {
                overDay = "(~" + finListDomains.get(0).getOverDay() + ")";
            }
            
            cell = row.createCell(6);
            cell.setCellValue(titles.get("overdue") + overDay);
            cell.setCellStyle(headerStyle);

            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 3, 5));
            
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 6, 8));
                        
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue(titles.get("mynet"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(1);
            cell.setCellValue(titles.get("partnet"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(2);
            cell.setCellValue(titles.get("cntry"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(3);
            cell.setCellValue(titles.get("revn"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(4);
            cell.setCellValue(titles.get("expn"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(5);
            cell.setCellValue(titles.get("prof"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(6);
            cell.setCellValue(titles.get("revn"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(7);
            cell.setCellValue(titles.get("expn"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(8);
            cell.setCellValue(titles.get("prof"));
            cell.setCellStyle(headerStyle);
            
            /**
             * Create Row Cells Using Result Data
             * 
             */
            int idx = 0;
            for (FinanceDomain finDomain : finListDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.trmPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getTrmPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.rcvPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getRcvPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.cntryNm
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getCntryNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.revenue
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getRevenue());
                cell.setCellStyle(rightAlignStyle);
                
                // 4.expense
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getExpense());
                cell.setCellStyle(rightAlignStyle);
                
                // 5.profit
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getProfit());
                cell.setCellStyle(rightAlignStyle);
                
                // 6.overRevenue
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getOverRevenue());
                cell.setCellStyle(rightAlignStyle);
                
                // 7.overExpense
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getOverExpense());
                cell.setCellStyle(rightAlignStyle);
                
                // 8.overProfit
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getOverProfit());
                cell.setCellStyle(rightAlignStyle);
                                
                idx = 0;
            }
            
            
            /**
             * Create Last Bottom Row Cells
             */
//            FinanceDomain firstTapRow = finListDomains.stream().findFirst().orElseGet(FinanceDomain::new);
//            
//            row = worksheet.createRow(++rowIdx);
//            
//            cell = row.createCell(0);
//            cell.setCellValue("TOTAL");
//            cell.setCellStyle(headerStyle);
//            
//            cell = row.createCell(3);
//            cell.setCellValue(firstTapRow.getRevenueSum());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(4);
//            cell.setCellValue(firstTapRow.getExpenseSum());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(5);
//            cell.setCellValue(firstTapRow.getProfitSum());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(6);
//            cell.setCellValue(firstTapRow.getOverRevenueSum());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(7);
//            cell.setCellValue(firstTapRow.getOverExpenseSum());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(8);
//            cell.setCellValue(firstTapRow.getOverProfitSum());
//            cell.setCellStyle(totalNumberStyle);
//            
//            
//            // Merge total Columns (current row idx, from column idx, to colum idx)
//            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 2));
        
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
