/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

import com.frxs.framework.util.common.log4j.LogUtil;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * AreabossApplication 启动入口
 *
 * @author colby.liu
 * @version $Id: AreabossApplication.java,v 0.1 2017年12月25日 11:34 $Exp
 */
@SpringBootApplication(scanBasePackages = {"com.frxs"})
public class AreabossApplication {

    public static void main(String[] args) {

        SpringApplication app = new SpringApplication(AreabossApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        ConfigurableApplicationContext context = app.run(args);
        LogUtil.info("AreabossApplication 启动成功");
    }
}