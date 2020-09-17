package com.kt.blink.biz.dashboard.controller;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.kt.blink.biz.admin.plmn.domain.PlmnsDomain;
import com.kt.blink.biz.admin.usermgr.domain.UserMgrDomain;
import com.kt.blink.biz.admin.usermgr.service.UserMgrService;
import com.kt.blink.biz.common.domain.CodeInfo;
import com.kt.blink.biz.common.domain.RestResponse;
import com.kt.blink.biz.common.service.CodeInfoService;
import com.kt.blink.biz.common.service.CommonService;
import com.kt.blink.biz.common.utils.MessageUtil;
import com.kt.blink.biz.dashboard.domain.DashDomain;
import com.kt.blink.biz.dashboard.domain.MainDomain;
import com.kt.blink.biz.dashboard.domain.MainSalesDomain;
import com.kt.blink.biz.dashboard.service.DashboardService;
import com.kt.blink.biz.dashboard.service.MainboardService;
import com.kt.blink.biz.user.domain.UserContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/mainboard")
@RestController
public class MainboardController {
	
    @Autowired
    private CodeInfoService codeInfoService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private MainboardService mainboardService;
	
	@Autowired
	UserMgrService userMgrService;

    @Autowired
    private MessageUtil messageUtil;

    @GetMapping
    public ModelAndView home(@AuthenticationPrincipal UserContext user) {
        log.info("[Dashboard]user=================>{}", user);
        
        return new ModelAndView("blink/dashboard/mainboard");
    }
    
    /**
     * dashboard init
     * @param tap
     * @return
     */
    @PostMapping("/getInit")
    public ResponseEntity<?> getInit(@RequestBody final DashDomain tap) {
        
        Map<String, Object> items = new HashMap<>();
        List<CodeInfo> partners = dashboardService.findCompList();
        
        CodeInfo cd = codeInfoService.findCodeByCdIdAndCdGrpId("DASH", "DecPoint");
        if(cd == null) {
            cd = new CodeInfo();
            cd.setCdVal1("0");
        }
        
        items.put("partners", partners);
        items.put("cd", cd);
        
        return ResponseEntity.ok(items);
    }
    
    @PostMapping("/getMainInfo")
    public ResponseEntity<?> getMainInfo(@RequestBody final MainDomain tap) {
                
        return ResponseEntity.ok(mainboardService.getMainInfo(tap));
    }
    

    @PostMapping("/getSalesInfo")
    public ResponseEntity<?> getSalesInfo(@RequestBody final MainSalesDomain tap) {
                
        return ResponseEntity.ok(mainboardService.getSalesInfo(tap));
    }
    
    @GetMapping("/getUserInfo")
    public ModelAndView getNoteInfo(@AuthenticationPrincipal UserContext user) {
        
        ModelAndView model = new ModelAndView("blink/dashboard/userPop");
        
        UserMgrDomain usr = new UserMgrDomain();
        usr.setUserId(user.getUsername());
        model.addObject("user", userMgrService.getUserInfo(usr));

        
        return model;
    }
    
    /**
     * get message
     * @return
     */
    @PostMapping("/getUserMsg")
    public ResponseEntity<?> getUserMsg() {

        //message
        Map<String, Object> msg = new HashMap<>();
        msg.put("saveReq", messageUtil.getMessage("com.save.req"));
        msg.put("msgEmail", messageUtil.getMessage("user.msg.email"));
        msg.put("msgNumdash", messageUtil.getMessage("com.msg.numdash"));
        msg.put("msgIp", messageUtil.getMessage("user.msg.ip"));
        msg.put("msgEmaildup", messageUtil.getMessage("user.msg.emaildup"));
        msg.put("msgEngnumspec", messageUtil.getMessage("com.msg.engnumspec"));
        
        return ResponseEntity.ok(msg);
    }

    /**
     * dup check user
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("/dupCheckUserMgr")
    public ResponseEntity<?> dupCheckUserMgr(@RequestBody final UserMgrDomain usermgr) {
        RestResponse restResponse = userMgrService.dupCheckUserMgr(usermgr);
        return ResponseEntity.ok(restResponse);
    }

    /**
     * update user
     * @param user
     * @param locale
     * @return
     */
    @PostMapping("updateUserMgr")
    public ResponseEntity<?> updateUserMgr(@RequestBody final UserMgrDomain usermgr, @AuthenticationPrincipal UserContext user) {

        usermgr.setSysTrtrId(user.getUsername());
        
        RestResponse restResponse = userMgrService.updateUserMgr(usermgr);
        return ResponseEntity.ok(restResponse);
    }   

    /**
     * set null
     */
    public void setNull(Object o) {
        
        try {
            Field[] fields = o.getClass().getDeclaredFields();
            
            for(Field field : fields) {
                String type = field.getType().getTypeName();
                String name = field.getName();
              log.debug("type : {}, name : {} ", type, name);
                if(StringUtils.equals(type, "java.lang.String")) {
                    PropertyDescriptor pd = new PropertyDescriptor(name, o.getClass());
                    Method getter = pd.getReadMethod();
                    Object f = getter.invoke(o);
                    
                    if(f == null) {
                        Method setter = pd.getWriteMethod();
                        setter.invoke(o, "");
                    }
                }
            }
        }catch(Exception e) {
            log.info("log parsing error ", e);
        }
    }
}
