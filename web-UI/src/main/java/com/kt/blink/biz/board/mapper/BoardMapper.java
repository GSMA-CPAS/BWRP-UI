/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.kt.blink.biz.board.domain.BoardDomain;

/**
 * Board Query Mapper
 */
@Mapper
@Repository
public interface BoardMapper {

    List<BoardDomain> findBoard(BoardDomain boardDomain);
    
    BoardDomain findBoardDetail(BoardDomain boardDomain);
    
    String findBoardAtcFileNameById(@Param("bbsId") Integer bbsId);
    
    int saveBoard(BoardDomain boardDomain);
    
    int saveBoardAtcFile(BoardDomain boardDomain);

    int updateBoard(BoardDomain boardDomain);

    int updateBoardAtcFile(BoardDomain boardDomain);

    int deleteBoardById(@Param("bbsId") Integer bbsId);

    int deleteBoardAtcFileById(@Param("bbsId") Integer bbsId);
 
    int increaseHitCountById(@Param("bbsId") Integer bbsId);
    
}
