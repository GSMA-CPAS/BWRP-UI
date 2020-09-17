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
public class InvoiceDetExcelView extends AbstractXlsxStreamingView {

    
    private Map<String, String> titles;
    private String cur;
    
    public InvoiceDetExcelView(Map<String, String> title, String cur) {
        this.titles = title;
        this.cur = cur;
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        String filename = (String) model.get("filename");
        Integer listPrcsn = Integer.parseInt((String) model.get("listPrcsn"));
        String attachFileName = this.getExcelFileName(request, filename);
        
        List<TapFileSumDomain> tapListDomains = (List<TapFileSumDomain>) model.get("results");
        
//        if (!tapListDomains.isEmpty()) {
            this.generateTapListExcel(tapListDomains, workbook, filename, listPrcsn);
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
    public void generateTapListExcel(List<TapFileSumDomain> tapListDomains, Workbook workbook, String filename, Integer precison) {
        
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
            totalDecimalStyle.setAlignment(HorizontalAlignment.RIGHT);
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
            cell.setCellValue("Tap List");
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
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(1);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(2);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(3);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
            cell = row.createCell(4);
            cell.setCellValue("");
            cell.setCellStyle(headerStyle);
                        
            
            cell = row.createCell(5);
            cell.setCellValue(titles.get("tot"));
            cell.setCellStyle(headerStyle);

            cell = row.createCell(7);
            cell.setCellValue(titles.get("moc"));
            cell.setCellStyle(headerStyle);

            cell = row.createCell(10);
            cell.setCellValue(titles.get("mtc"));
            cell.setCellStyle(headerStyle);

            cell = row.createCell(13);
            cell.setCellValue(titles.get("data"));
            cell.setCellStyle(headerStyle);

            cell = row.createCell(16);
            cell.setCellValue(titles.get("sms"));
            cell.setCellStyle(headerStyle);
            
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 5, 6));
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 7, 9));
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 10, 12));
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 13, 15));
            worksheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 16, 17));
                        
            row = worksheet.createRow(++rowIdx);
            cell = row.createCell(0);
            cell.setCellValue(titles.get("date"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(1);
            cell.setCellValue(titles.get("mynet"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(2);
            cell.setCellValue(titles.get("partnet"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(3);
            cell.setCellValue(titles.get("direct"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(4);
            cell.setCellValue(titles.get("seq"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(5);
            cell.setCellValue(titles.get("rcd"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(6);
            cell.setCellValue(titles.get("grs"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(7);
            cell.setCellValue(titles.get("rcd"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(8);
            cell.setCellValue(titles.get("dur"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(9);
            cell.setCellValue(titles.get("grs"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(10);
            cell.setCellValue(titles.get("rcd"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(11);
            cell.setCellValue(titles.get("dur"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(12);
            cell.setCellValue(titles.get("grs"));
            cell.setCellStyle(headerStyle);

            cell = row.createCell(13);
            cell.setCellValue(titles.get("rcd"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(14);
            cell.setCellValue(titles.get("vol"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(15);
            cell.setCellValue(titles.get("grs"));
            cell.setCellStyle(headerStyle);
            
            cell = row.createCell(16);
            cell.setCellValue(titles.get("rcd"));
            cell.setCellStyle(headerStyle);
            cell = row.createCell(17);
            cell.setCellValue(titles.get("grs"));
            cell.setCellStyle(headerStyle);
            /**
             * Create Row Cells Using Result Data
             * 
             */
            int idx = 0;
            for (TapFileSumDomain finDomain : tapListDomains) {
                row = worksheet.createRow(++rowIdx);
                
                // 0.fileCretDateVal
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getFileCretDateVal());
                cell.setCellStyle(centerAlignStyle);
                
                // 1.trmPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getTrmPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 2.rcvPlmnId
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getRcvPlmnId());
                cell.setCellStyle(centerAlignStyle);
                
                // 3.invocDirectCdNm
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getInvocDirectCdNm());
                cell.setCellStyle(centerAlignStyle);
                
                // 4.tapSeq
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getTapSeq());
                cell.setCellStyle(rightAlignStyle);
                
                // 5.totSumRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getTotSumRecdCnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 6.totSumAmt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getTotSumAmt());
                cell.setCellStyle(rightAlignStyle);
                
                // 7.mocVoRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getMocVoRecdCnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 8.mocVoUseQnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getMocVoUseQnt());
                cell.setCellStyle(rightAlignStyle);
                                
                // 9.mocVoCalcAmt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getMocVoCalcAmt());
                cell.setCellStyle(rightAlignStyle);
                
                // 10.mtcVoRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getMtcVoRecdCnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 11.mtcVoUseQnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getMtcVoUseQnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 12.mtcVoCalcAmt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getMtcVoCalcAmt());
                cell.setCellStyle(rightAlignStyle);
                
                // 13.dataRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getDataRecdCnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 14.dataUseQnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getDataUseQnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 15.dataCalcAmt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getDataCalcAmt());
                cell.setCellStyle(rightAlignStyle);
                
                // 16.smsRecdCnt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getSmsRecdCnt());
                cell.setCellStyle(rightAlignStyle);
                
                // 17.smsCalcAmt
                cell = row.createCell(idx++);
                cell.setCellValue(finDomain.getSmsCalcAmt());
                cell.setCellStyle(rightAlignStyle);
                
                idx = 0;
            }
            
            
            /**
             * Create Last Bottom Row Cells
             */
//            TapFileSumDomain firstTapRow = tapListDomains.stream().findFirst().orElseGet(TapFileSumDomain::new);
//            
//            row = worksheet.createRow(++rowIdx);
//            
//            cell = row.createCell(0);
//            cell.setCellValue("TOTAL");
//            cell.setCellStyle(headerStyle);
//            
//            cell = row.createCell(5);
//            cell.setCellValue(firstTapRow.getTotSumTotRecdCnt());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(6);
//            cell.setCellValue(firstTapRow.getTotSumTotAmt());
//            cell.setCellStyle(totalNumberStyle);
//            
//            cell = row.createCell(7);
//            cell.setCellValue(firstTapRow.getMocTotVoRecdCnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(8);
//            cell.setCellValue(firstTapRow.getMocTotVoUseQnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(9);
//            cell.setCellValue(firstTapRow.getMocTotVoCalcAmt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(10);
//            cell.setCellValue(firstTapRow.getMtcTotVoRecdCnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(11);
//            cell.setCellValue(firstTapRow.getMtcTotVoUseQnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(12);
//            cell.setCellValue(firstTapRow.getMtcTotVoCalcAmt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(13);
//            cell.setCellValue(firstTapRow.getDataTotRecdCnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(14);
//            cell.setCellValue(firstTapRow.getDataTotUseQnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(15);
//            cell.setCellValue(firstTapRow.getDataTotCalcAmt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(16);
//            cell.setCellValue(firstTapRow.getSmsTotRecdCnt());
//            cell.setCellStyle(totalNumberStyle);
//
//            cell = row.createCell(17);
//            cell.setCellValue(firstTapRow.getSmsTotCalcAmt());
//            cell.setCellStyle(totalNumberStyle);
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
