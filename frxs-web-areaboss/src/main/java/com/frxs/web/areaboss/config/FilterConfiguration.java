package com.frxs.web.areaboss.config;

import com.alibaba.dubbo.config.ApplicationConfig;
import com.alibaba.dubbo.config.ReferenceConfig;
import com.alibaba.dubbo.config.RegistryConfig;
import com.frxs.sso.model.ReferenceConfigMap;
import com.frxs.sso.rpc.AuthenticationRpcService;
import com.frxs.sso.sso.LogoutFilter;
import com.frxs.sso.sso.PermissionFilter;
import com.frxs.sso.sso.SsoFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;


@Configuration
@ComponentScan(basePackages = {"com.frxs.sso"})
public class FilterConfiguration {

    @Value("${sso.server.url}")
    private String serverUrl;
    @Value("${sso.timeout}")
    private String ssoTimeOut;
    @Value("${sso.app.code}")
    private String appCode;
    @Value("${sso.zookeeper.address}")
    private String address;
    private ApplicationConfig application;
    private RegistryConfig registry;
    private static final String PROTOCOL = "zookeeper";
    private static final String SERVICEID = "authenticationRpcService";

    @Bean
    public FilterRegistrationBean logOutFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new LogoutFilter());
        registration.addUrlPatterns("/logout");
        registration.addInitParameter("sso.server.url", this.serverUrl);
        registration.addInitParameter("sso.app.code", this.appCode);
        registration.setName("logOutFilter");
        registration.setOrder(1);
        return registration;
    }

    @Bean
    public FilterRegistrationBean ssoFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new SsoFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("sso.server.url", this.serverUrl);
        registration.addInitParameter("sso.timeout", this.ssoTimeOut);
        registration.addInitParameter("sso.app.code", this.appCode);
        registration.setName("ssoFilter");
        registration.setOrder(2);
        return registration;
    }

    @Bean
    public FilterRegistrationBean permissionFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new PermissionFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("sso.server.url", this.serverUrl);
        registration.addInitParameter("sso.timeout", this.ssoTimeOut);
        registration.addInitParameter("sso.app.code", this.appCode);
        registration.setName("permissionFilter");
        registration.setOrder(3);
        return registration;
    }

    @Bean
    public ReferenceConfigMap referenceConfigMap() {
        ReferenceConfigMap map = new ReferenceConfigMap();
        ReferenceConfig<AuthenticationRpcService> reference = new ReferenceConfig<>();
        reference.setApplication(applicationConfig());
        reference.setRegistry(registryConfig());
        reference.setId(SERVICEID);
        reference.setInterface(AuthenticationRpcService.class);
        map.put(AuthenticationRpcService.class.getName(), reference);
        return map;
    }


    public ApplicationConfig applicationConfig() {
        ApplicationConfig application = new ApplicationConfig();
        application.setName(this.appCode);
        this.application = application;
        return application;
    }

    public RegistryConfig registryConfig() {
        RegistryConfig registry = new RegistryConfig();
        registry.setAddress(this.address);
        registry.setProtocol(PROTOCOL);
        this.registry = registry;
        return registry;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public String getSsoTimeOut() {
        return ssoTimeOut;
    }

    public void setSsoTimeOut(String ssoTimeOut) {
        this.ssoTimeOut = ssoTimeOut;
    }

    public String getAppCode() {
        return appCode;
    }

    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public ApplicationConfig getApplication() {
        return application;
    }

    public void setApplication(ApplicationConfig application) {
        this.application = application;
    }

    public RegistryConfig getRegistry() {
        return registry;
    }

    public void setRegistry(RegistryConfig registry) {
        this.registry = registry;
    }
}