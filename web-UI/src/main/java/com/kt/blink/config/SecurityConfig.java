/*
 * B-LINK (Block Chain Link) version 1.0
 * Copyright ⓒ 2019 kt corp. All rights reserved.
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 */
package com.kt.blink.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.blink.biz.common.security.LoginAuthenticationFilter;
import com.kt.blink.biz.common.security.LoginAuthenticationProvider;
import com.kt.blink.biz.common.security.LoginProcessAfterHandler;

/**
 * SecurityConfig
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private static final String LOGIN_ENTRY_POINT = "/login";
    
    @Autowired
    private LoginAuthenticationProvider ajaxProvider;

    @Autowired
    private LoginProcessAfterHandler loginProcessAfterHandler; // handle both login success, fail 
    
    @Autowired
    private ObjectMapper objectMapper;
    


    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/css/**", "/js/**", "/images/**", "/dataTables/**");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(ajaxProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .addFilterBefore(loginAuthenticationFilter(objectMapper, loginProcessAfterHandler), UsernamePasswordAuthenticationFilter.class)
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/resources/**", "/", "/login*", "/changeCredential*", "/licenseNotice*").permitAll()
//            .antMatchers("/admin/**", "/cntry/**", "/cmpn/**", "/plmn/**", "/erate/**", "/usermgr/**").access("hasRole('ROLE_ADMIN')")
            .antMatchers("/admin/**", "/cntry/**", "/cmpn/**", "/plmn/**", "/erate/**", "/usermgr/**", "/user/**", "/dch/**", "/fch/**", "/dashboard/**", "/todo/**")
            .access("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
            .and()
            .formLogin().loginPage("/login")
            .and()
            .logout()
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login?logout")
            //.logoutSuccessHandler(logoutSuccessHandler())
            //.addLogoutHandler(cookieClearingLogoutHandler)
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID")
            //.clearAuthentication(true)
            .permitAll()
            .and()
            .sessionManagement()
            .invalidSessionUrl("/login?logout");
        
    }
    
    
    @Bean
    public AntPathRequestMatcher antPathRequestMatcher() {
        return new AntPathRequestMatcher(LOGIN_ENTRY_POINT, HttpMethod.POST.name());
    }
    
    @Bean
    public LoginAuthenticationFilter loginAuthenticationFilter(ObjectMapper objectMapper, LoginProcessAfterHandler loginProcessAfterHandler) throws Exception {
        LoginAuthenticationFilter filter = new LoginAuthenticationFilter(antPathRequestMatcher(), objectMapper);
        filter.setAuthenticationManager(authenticationManager());
        filter.setAuthenticationSuccessHandler(loginProcessAfterHandler);
        filter.setAuthenticationFailureHandler(loginProcessAfterHandler);
        return filter;
    }

    
}