/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.finance.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.math3.exception.DimensionMismatchException;
import org.apache.commons.math3.exception.MathRuntimeException;
import org.apache.commons.math3.exception.util.LocalizedFormats;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kt.blink.biz.common.constant.CharConst;
import com.kt.blink.biz.common.constant.CodeConst;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.exception.domain.CommonException;
import com.kt.blink.biz.common.exception.domain.ErrorCode;
import com.kt.blink.biz.common.utils.CommonUtil;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.common.utils.ResponseUtil;
import com.kt.blink.biz.fch.finance.domain.FinanceReportDomain;
import com.kt.blink.biz.fch.finance.domain.FinanceSalesDomain;
import com.kt.blink.biz.fch.finance.mapper.FinanceReportMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Finance report service
 */
@Slf4j
@Service
public class FinanceReportService {

    @Autowired
    private FinanceReportMapper financeReportMapper;
            
    @Autowired
    private ResponseUtil responseUtil;
    
    @Autowired
    private MessageUtil messageUtil;
    
    @Autowired
    private CommonUtil commonUtil;
    
    
    /**
     * find sales info
     * * The current month exchange rate is applied unconditionally
     * @param financeReportDomain
     * @return
     */
    public RestResponse findSalesInfo(FinanceReportDomain financeReportDomain) {
        try {
            
            List<List<FinanceReportDomain>> salesInfos = new ArrayList<>();
            List<List<FinanceReportDomain>> regressionInfos = new ArrayList<>();
            List<String> partnerNetworks = null;
            String partnerNetwork = null;
            
            List<String> periods = financeReportDomain.getPeriods();
            String period = commonUtil.getCommaSeparatedValues(periods);
            log.info("period========================>{}", period);
            financeReportDomain.setPeriod(period);
            
            // if the request came from dashboard, get plmns from company code
            if (!StringUtils.isBlank(financeReportDomain.getCompanyCode()) && CharConst.DASH.equals(financeReportDomain.getCompanyCode())) {
                log.info("DashBoard Without Selected Company==============>");
                return responseUtil.restReponse(financeReportDomain);
            } else if (!StringUtils.isBlank(financeReportDomain.getCompanyCode()) && !CharConst.DASH.equals(financeReportDomain.getCompanyCode())) {
                log.info("DashBoard With Selected Company=================>{}", financeReportDomain.getCompanyCode());
                partnerNetworks = financeReportMapper.findPartnerNetworksFromCompanyCode(financeReportDomain.getCompanyCode());
                financeReportDomain.setPartnerNetworks(partnerNetworks);
                partnerNetwork = commonUtil.getCommaSeparatedValues(partnerNetworks);
            } else {
                log.info("Forecast Salse========================>");
                partnerNetworks = financeReportDomain.getPartnerNetworks();
                partnerNetwork = commonUtil.getCommaSeparatedValues(partnerNetworks);
            }
            
            financeReportDomain.setPartnerNetwork(partnerNetwork);
            log.info("partnerNetwork================>{}", partnerNetwork);
            String unit = financeReportDomain.getUnit();
            
            List<String> callTypes = financeReportDomain.getCallTypes();
            
            callTypes.forEach( callType -> {
                log.info("@callType=================>{}", callType);
                
                financeReportDomain.setCallType(callType);
                
                if (CodeConst.SALES_UNIT_AMOUNT.equals(unit)) {
                    log.info("@Amount=================>");
                    List<FinanceReportDomain> regressionInfo = Optional.ofNullable(financeReportMapper.findRegressionInfoByAmount(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    regressionInfos.add(regressionInfo);
                    
                    List<FinanceReportDomain> salesInfo = Optional.ofNullable(financeReportMapper.findSalesInfoByAmount(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    salesInfos.add(salesInfo);
                    
                } else if (CodeConst.SALES_UNIT_COUNT.equals(unit)) {
                    log.info("@Count==================>");
                    List<FinanceReportDomain> regressionInfo = Optional.ofNullable(financeReportMapper.findRegressionInfoByCount(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    regressionInfos.add(regressionInfo);
                    
                    List<FinanceReportDomain> salesInfo = Optional.ofNullable(financeReportMapper.findSalesInfoByCount(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    salesInfos.add(salesInfo);
                    
                } else if (CodeConst.SALES_UNIT_VOLUME.equals(unit)) {
                    log.info("@Volume=================>");
                    List<FinanceReportDomain> regressionInfo = Optional.ofNullable(financeReportMapper.findRegressionInfoByVolume(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    regressionInfos.add(regressionInfo);
                    
                    List<FinanceReportDomain> salesInfo = Optional.ofNullable(financeReportMapper.findSalesInfoByVolume(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    salesInfos.add(salesInfo);
                    
                } else if (CodeConst.SALES_UNIT_IMSI.equals(unit)) {
                    log.info("@IMSI==================>");
                    List<FinanceReportDomain> regressionInfo = Optional.ofNullable(financeReportMapper.findRegressionInfoByIMSI(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    regressionInfos.add(regressionInfo);
                    
                    List<FinanceReportDomain> salesInfo = Optional.ofNullable(financeReportMapper.findSalesInfoByIMSI(financeReportDomain))
                            .orElse(Collections.emptyList());
                    
                    salesInfos.add(salesInfo);
                    
                }
                
            });
            
            log.info("salesInfos========>{}", salesInfos);
            log.info("salesInfos========>{}", salesInfos.size());
            log.info("regressionInfos========>{}", regressionInfos);
            log.info("regressionInfos========>{}", regressionInfos.size());
            
            // forecast result map
            Map<Integer, Double> forecastMap = this.getForecastResultsFromPastSales(regressionInfos);
            List<FinanceSalesDomain> salesInfoResults = this.processSalesInfo(salesInfos, forecastMap);
            
            return responseUtil.restReponse(salesInfoResults);
            
        } catch (Exception ex) {
            throw new CommonException(messageUtil.getMessage("app.error.9001"), ErrorCode.INTERNAL_SERVER_ERROR, ex);
        }
        
    }
    
    
    /**
     * get forecast data from past sales data
     * 
     * @param regressionInfos
     */
    public Map<Integer, Double> getForecastResultsFromPastSales(List<List<FinanceReportDomain>> regressionInfos) {
        List<FinanceSalesDomain> regressionInfoResults = new ArrayList<>();
        Map<Integer, Double> forecastMap = new HashMap<>();
        
        // group by year
        Map<String, List<FinanceReportDomain>> uniqueSalesMap = regressionInfos.stream()
                .flatMap(List::stream)
                .collect(Collectors.toList())
                .stream()
                .collect(Collectors.groupingBy(FinanceReportDomain::getYear));
        
        // reduce data
        List<FinanceReportDomain> mergedSales = uniqueSalesMap.values().stream()
                .map(group -> group.stream().reduce((a, b) -> new FinanceReportDomain(
                        a.getYear(),
                        a.getJan() + b.getJan(),
                        a.getFeb() + b.getFeb(),
                        a.getMar() + b.getMar(),
                        a.getApr() + b.getApr(),
                        a.getMay() + b.getMay(),
                        a.getJun() + b.getJun(),
                        a.getJul() + b.getJul(),
                        a.getAug() + b.getAug(),
                        a.getSep() + b.getSep(),
                        a.getOct() + b.getOct(),
                        a.getNov() + b.getNov(),
                        a.getDec() + b.getDec(),
                        a.getTotal() + b.getTotal()
                )).orElseGet(FinanceReportDomain::new))
                .collect(Collectors.toList());
        
        mergedSales.stream().sorted(Comparator.comparing(FinanceReportDomain::getYear)).forEach(sales -> {
            FinanceSalesDomain financeSalesDomain = new FinanceSalesDomain(
                    sales.getYear(), 
                    new Double[] {
                        sales.getJan(),
                        sales.getFeb(),
                        sales.getMar(),
                        sales.getApr(),
                        sales.getMay(),
                        sales.getJun(),
                        sales.getJul(),
                        sales.getAug(),
                        sales.getSep(),
                        sales.getOct(),
                        sales.getNov(),
                        sales.getDec(),
                    }
            );
            
            regressionInfoResults.add(financeSalesDomain);
            
        });
        
        log.info("@regressionInfoResults==========>{}", regressionInfoResults);
        log.info("@regressionInfoResults.size=====>{}", regressionInfoResults.size());
        
        if (regressionInfoResults.isEmpty()) {
            return forecastMap;
        }

        List<Double> jan = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 0)).orElse(Collections.emptyList()); // index is month
        List<Double> feb = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 1)).orElse(Collections.emptyList());
        List<Double> mar = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 2)).orElse(Collections.emptyList());
        List<Double> apr = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 3)).orElse(Collections.emptyList());
        List<Double> may = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 4)).orElse(Collections.emptyList());
        List<Double> jun = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 5)).orElse(Collections.emptyList());
        List<Double> jul = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 6)).orElse(Collections.emptyList());
        List<Double> aug = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 7)).orElse(Collections.emptyList());
        List<Double> sep = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 8)).orElse(Collections.emptyList());
        List<Double> oct = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 9)).orElse(Collections.emptyList());
        List<Double> nov = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 10)).orElse(Collections.emptyList());
        List<Double> dec = Optional.ofNullable(this.getRegressionArrayFormatData(regressionInfoResults, 11)).orElse(Collections.emptyList());
        
        log.info("@jan==========>{}", jan);
        log.info("@feb==========>{}", feb);
        log.info("@mar==========>{}", mar);
        log.info("@apr==========>{}", apr);
        log.info("@may==========>{}", may);
        log.info("@jun==========>{}", jun);
        log.info("@jul==========>{}", jul);
        log.info("@aug==========>{}", aug);
        log.info("@sep==========>{}", sep);
        log.info("@oct==========>{}", oct);
        log.info("@nov==========>{}", nov);
        log.info("@dec==========>{}", dec);
        
        double janForecast = this.getPredicate(jan, (double)(jan.size() + 1)); // forecast is 1
        double febForecast = this.getPredicate(feb, (double)(jan.size() + 1));
        double marForecast = this.getPredicate(mar, (double)(jan.size() + 1));
        double aprForecast = this.getPredicate(apr, (double)(jan.size() + 1));
        double mayForecast = this.getPredicate(may, (double)(jan.size() + 1));
        double junForecast = this.getPredicate(jun, (double)(jan.size() + 1));
        double julForecast = this.getPredicate(jul, (double)(jan.size() + 1));
        double augForecast = this.getPredicate(aug, (double)(jan.size() + 1));
        double sepForecast = this.getPredicate(sep, (double)(jan.size() + 1));
        double octForecast = this.getPredicate(oct, (double)(jan.size() + 1));
        double novForecast = this.getPredicate(nov, (double)(jan.size() + 1));
        double decForecast = this.getPredicate(dec, (double)(jan.size() + 1));
        
        log.info("@janForecast.forcast.result==========>{}", janForecast);
        log.info("@febForecast.forcast.result==========>{}", febForecast);
        log.info("@marForecast.forcast.result==========>{}", marForecast);
        log.info("@aprForecast.forcast.result==========>{}", aprForecast);
        log.info("@mayForecast.forcast.result==========>{}", mayForecast);
        log.info("@junForecast.forcast.result==========>{}", junForecast);
        log.info("@julForecast.forcast.result==========>{}", julForecast);
        log.info("@augForecast.forcast.result==========>{}", augForecast);
        log.info("@sepForecast.forcast.result==========>{}", sepForecast);
        log.info("@octForecast.forcast.result==========>{}", octForecast);
        log.info("@novForecast.forcast.result==========>{}", novForecast);
        log.info("@decForecast.forcast.result==========>{}", decForecast);

        forecastMap.put(1, janForecast);
        forecastMap.put(2, febForecast);
        forecastMap.put(3, marForecast);
        forecastMap.put(4, aprForecast);
        forecastMap.put(5, mayForecast);
        forecastMap.put(6, junForecast);
        forecastMap.put(7, julForecast);
        forecastMap.put(8, augForecast);
        forecastMap.put(9, sepForecast);
        forecastMap.put(10, octForecast);
        forecastMap.put(11, novForecast);
        forecastMap.put(12, decForecast);
        
        return forecastMap;
        
    }


    /**
     * get Regression process array format data from List
     * 
     * @param regressionInfoResults
     * @param month
     * @return
     */
    public List<Double> getRegressionArrayFormatData(List<FinanceSalesDomain> regressionInfoResults, Integer idx) {
        
        List<Double> month = new ArrayList<>();
        
        regressionInfoResults.forEach(regressionInfo -> {
            
            String name = regressionInfo.getName();
            Double[] data = regressionInfo.getData();
            log.info("@name==========>{}", name);
            log.info("@data==========>{}", Arrays.asList(data));
            
            for (int i = 0; i < data.length; i++) {
                if (i == idx) {
                    month.add(data[i]);
                    break;
                }
            }
            
        });
        
        return month;
        
    }
    
    
    /**
     * process sales info
     * 
     * @param results
     * @return
     */
    public List<FinanceSalesDomain> processSalesInfo(List<List<FinanceReportDomain>> salesInfos, Map<Integer, Double> forecastMap) {
        log.info("[ZZZ]forecastMap========================>{}", forecastMap);
        
        List<FinanceSalesDomain> salesInfoResults = new ArrayList<>();
        
        // group by year
        Map<String, List<FinanceReportDomain>> uniqueSalesMap = salesInfos.stream()
                .flatMap(List::stream)
                .collect(Collectors.toList())
                .stream()
                .collect(Collectors.groupingBy(FinanceReportDomain::getYear));
        
        // reduce data of each year
        List<FinanceReportDomain> mergedSales = uniqueSalesMap.values().stream()
                .map(group -> group.stream().reduce((a, b) -> new FinanceReportDomain(
                        a.getYear(),
                        a.getJan() + b.getJan(),
                        a.getFeb() + b.getFeb(),
                        a.getMar() + b.getMar(),
                        a.getApr() + b.getApr(),
                        a.getMay() + b.getMay(),
                        a.getJun() + b.getJun(),
                        a.getJul() + b.getJul(),
                        a.getAug() + b.getAug(),
                        a.getSep() + b.getSep(),
                        a.getOct() + b.getOct(),
                        a.getNov() + b.getNov(),
                        a.getDec() + b.getDec(),
                        a.getTotal() + b.getTotal()
                )).orElseGet(FinanceReportDomain::new))
                .collect(Collectors.toList());
        
        log.info("@mergedSales==========>{}", mergedSales);
        
        // sort by year then forecast then create domain object for frontend
        mergedSales.stream().sorted(Comparator.comparing(FinanceReportDomain::getYear)).forEach(sales -> {
            
            // update sales info by forecast if date exists
            if (!forecastMap.isEmpty()) {
                sales = this.updateSalesInfoByForecast(sales, forecastMap);
            }
            
            FinanceSalesDomain financeSalesDomain = new FinanceSalesDomain(
                    sales.getYear(),
                    new Double[] {
                        sales.getJan(),
                        sales.getFeb(),
                        sales.getMar(),
                        sales.getApr(),
                        sales.getMay(),
                        sales.getJun(),
                        sales.getJul(),
                        sales.getAug(),
                        sales.getSep(),
                        sales.getOct(),
                        sales.getNov(),
                        sales.getDec(),
                    }
            );
            
            salesInfoResults.add(financeSalesDomain);
            
        });
        
        log.info("@salesInfoResults==========>{}", salesInfoResults);
        log.info("@salesInfoResults.size=====>{}", salesInfoResults.size());
        
        return salesInfoResults;
        
    }
    
    
    /**
     * update sales info by forecast regression data
     * 
     * @param sales
     * @param thisYear
     * @param forecastMap
     * @return
     */
    private FinanceReportDomain updateSalesInfoByForecast(FinanceReportDomain sales, Map<Integer, Double> forecastMap) {
        
        LocalDate now = LocalDate.now();
        final int thisYear = now.getYear();
        final int thisMonth = now.getMonthValue();
        log.info("thisYear============>{}", thisYear);
        log.info("thisMonth===========>{}", thisMonth);
        
        if (sales.getYear().equals(String.valueOf(thisYear))) {
            log.info("[FR]update sale info by forecast data===================>");
            if (thisMonth == 1) {
                log.info("Jan============>");
                sales.setJan(forecastMap.get(1));
                sales.setFeb(forecastMap.get(2));
                sales.setMar(forecastMap.get(3));
                sales.setApr(forecastMap.get(4));
                sales.setMay(forecastMap.get(5));
                sales.setJun(forecastMap.get(6));
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 2) {
                log.info("Feb============>");
                sales.setFeb(forecastMap.get(2));
                sales.setMar(forecastMap.get(3));
                sales.setApr(forecastMap.get(4));
                sales.setMay(forecastMap.get(5));
                sales.setJun(forecastMap.get(6));
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 3) {
                log.info("Mar============>");
                sales.setMar(forecastMap.get(3));
                sales.setApr(forecastMap.get(4));
                sales.setMay(forecastMap.get(5));
                sales.setJun(forecastMap.get(6));
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 4) {
                log.info("Apr============>");
                sales.setApr(forecastMap.get(4));
                sales.setMay(forecastMap.get(5));
                sales.setJun(forecastMap.get(6));
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 5) {
                log.info("May============>");
                sales.setMay(forecastMap.get(5));
                sales.setJun(forecastMap.get(6));
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 6) {
                log.info("Jun============>");
                sales.setJun(forecastMap.get(6));
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 7) {
                log.info("Jul============>");
                sales.setJul(forecastMap.get(7));
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 8) {
                log.info("Aug============>");
                sales.setAug(forecastMap.get(8));
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 9) {
                log.info("Sep============>");
                sales.setSep(forecastMap.get(9));
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 10) {
                log.info("Oct============>");
                sales.setOct(forecastMap.get(10));
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 11) {
                log.info("Nov============>");
                sales.setNov(forecastMap.get(11));
                sales.setDec(forecastMap.get(12));
            } else if (thisMonth == 12) {
                log.info("Dec============>");
                sales.setDec(forecastMap.get(12));
            }
        }
        
        return sales;
        
    }


    /**
     * Computes the Pearson's product-moment correlation coefficient between the two arrays.
     *
     * </p>Throws IllegalArgumentException if the arrays do not have the same length
     * or their common length is less than 2</p>
     *
     * @param series first data array
     * @param data second data array
     * @return Returns Pearson's correlation coefficient for the two arrays
     * @throws  IllegalArgumentException if the arrays lengths do not match or there is insufficient data
     */
    public double getPredicate(final List<Double> data, double target) {
        log.info("data============>{}", data);
        log.info("target==========>{}", target);
        double[] monthData = data.stream().mapToDouble(Double::doubleValue).toArray(); // Y
        double[] series = new double[monthData.length]; // X
        
        for (int i = 0; i < series.length; i++) {
            series[i] = (double) (i + 1);
        }
        
        log.info("X array==========>{}", series);
        log.info("Y array==========>{}", monthData);
        log.info("target===========>{}", target);
        
        SimpleRegression regression = new SimpleRegression();
        if (series.length != monthData.length) {
            throw new DimensionMismatchException(series.length, monthData.length);
        } else if (series.length < 2) {
            throw new MathRuntimeException(LocalizedFormats.INSUFFICIENT_DIMENSION, series.length, 2);
        } else {
            for (int i = 0; i < series.length; i++) {
                regression.addData(series[i], monthData[i]);
            }
            
            return regression.predict(target);
        }
        
    }
    
    
}
