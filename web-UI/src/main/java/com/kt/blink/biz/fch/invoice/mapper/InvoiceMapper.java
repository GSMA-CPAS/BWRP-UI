/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.invoice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.dashboard.domain.DashDomain;
import com.kt.blink.biz.fch.invoice.domain.InvUser;
import com.kt.blink.biz.fch.invoice.domain.InvoiceAmtListDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceErateListDomain;
import com.kt.blink.biz.fch.invoice.domain.TapDaySumDomain;
import com.kt.blink.biz.fch.invoice.domain.TapFileSumDomain;

@Mapper
@Repository
public interface InvoiceMapper {
    
    /**
     * invoice/note list
     * @param inv
     * @return
     */
    List<TapFileSumDomain> retrieveInvoiceList(InvoiceDomain inv);
    /**
     * update invoice state
     * @param invoc
     * @return
     */
    Integer updateInvoiceStat(@Param("invoc") InvoiceDomain invoc);
    /**
     * invoice amt list
     * @param invoc
     * @return
     */
    List<InvoiceAmtListDomain> getInvocAmtList(@Param("invoc") InvoiceDomain invoc);
    /**
     * invoice info
     * @param invoc
     * @return
     */
    InvoiceDomain getInvocInfo(@Param("invoc") InvoiceDomain invoc);
    
    /**
     * retrieve daily tap list
     * @param inv
     * @return
     */
    List<TapFileSumDomain> retrieveDayTapList(@Param("invoc") InvoiceDomain invoc);
    /**
     * invoice daily sum
     * @param invoc
     * @return
     */
    TapFileSumDomain retrieveDayTapListSum(@Param("invoc") InvoiceDomain invoc);
    /**
     * invoice erate list
     * @param invoc
     * @return
     */
    List<InvoiceErateListDomain> getInvocErateList(@Param("invoc") InvoiceDomain invoc);
    /**
     * invoice daily list
     * @param invoc
     * @return
     */
    List<TapDaySumDomain> retrieveInvDayList(@Param("invoc") InvoiceDomain invoc);
    /**
     * invoice daily list SUM
     * @param invoc
     * @return
     */
    TapDaySumDomain retrieveInvDayListSum(@Param("invoc") InvoiceDomain invoc);
    
    /**
     * invoice contact info
     * @param invoc
     * @return
     */
    InvUser getInvContactInfo(@Param("invoc") InvoiceDomain invoc);
    /**
     * in/out bound commitment
     * @param tap
     * @return
     */
    DashDomain getInvInOutCommitInfo(DashDomain tap);
    /**
     * in/out bound commitment amt
     * @param tap
     * @return
     */
    DashDomain getInvInOutCommitAmt(DashDomain tap);
}
