package com.kt.blink;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@Ignore
@RunWith(SpringRunner.class)
@SpringBootTest
public class BlinkWebApplicationTests {

    private static final Logger log = LoggerFactory.getLogger(BlinkWebApplicationTests.class);
    
    @Test
    public void contextLoads() {
        log.info("Blink Test Application.............");
    }

}
