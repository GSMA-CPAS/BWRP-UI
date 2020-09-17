/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.biz.user.domain;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * UserContext
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class UserContext extends User {
  
    private String firstName;
    private String lastName;
    private String fullname;
    private String company;
    private String cmpnId;
    private Integer btnRole;
    private Boolean tempPwdIssYn;
    
    private static final long serialVersionUID = -5399166150299154449L;

    public UserContext(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired,
            boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities, 
            String firstName, String lastName, String fullname, String company, String cmpnId, Integer btnRole, Boolean tempPwdIssYn) {
      
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullname = fullname;
        this.company = company;
        this.cmpnId = cmpnId;
        this.btnRole = btnRole;
        this.tempPwdIssYn = tempPwdIssYn;
        
    }
    
    
}
