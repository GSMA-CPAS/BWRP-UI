/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.fch.cna.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.fch.cna.domain.NoteAmtListDomain;
import com.kt.blink.biz.fch.cna.domain.NoteDomain;
import com.kt.blink.biz.fch.invoice.domain.InvoiceDomain;

@Mapper
@Repository
public interface CnaMapper {
 
    /**
     * note reg info
     * @param invoc
     * @return
     */
    NoteDomain getInvCnaInfo(InvoiceDomain invoc);
    /**
     * isert note
     * @param note
     * @return
     */
    Integer insertNote(NoteDomain note);
    /**
     * note amt list insert
     * @param note
     * @return
     */
    Integer insertNoteAmt(NoteDomain note);
    
    /**
     * update note status
     * @param note
     * @return
     */
    Integer updateNote(NoteDomain note);
    
    /**
     * note info
     * @param note
     * @return
     */
    NoteDomain getNoteInfo(NoteDomain note);
    /**
     * note amt list
     * @param invoc
     * @return
     */
    List<NoteAmtListDomain> getNoteAmtList(NoteDomain note);
    /**
     * check dup note number
     * @param note
     * @return
     */
    NoteDomain checkNoteNumDup(NoteDomain note);
}
