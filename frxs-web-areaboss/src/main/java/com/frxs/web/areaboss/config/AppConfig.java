/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.config;

import com.ctrip.framework.apollo.spring.annotation.EnableApolloConfig;
import org.springframework.context.annotation.Configuration;

/**
 *  APP默认配置加载
 *
 * @author mingbo.tang
 * @version $Id: AppConfig.java,v 0.1 2017年12月26日 下午 14:31 $Exp
 */

@Configuration
@EnableApolloConfig(value = "application", order = 1)
public class AppConfig {

}

