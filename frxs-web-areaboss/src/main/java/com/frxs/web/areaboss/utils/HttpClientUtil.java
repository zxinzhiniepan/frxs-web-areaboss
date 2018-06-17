/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.utils;


import com.frxs.framework.util.common.StringUtil;
import com.frxs.framework.util.common.log4j.LogUtil;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import lombok.Data;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 请求客户端
 *
 * @author sh
 * @version $Id: HttpClientUtil.java,v 0.1 2018年02月26日 上午 11:49 $Exp
 */

@Component
@Data
public class HttpClientUtil {

    /**
     * 最大连接数
     */

    @Value("${httpClient.maxTotal:1000}")
    private Integer maxTotal;
    /**
     * socket超时时间
     */

    @Value("${httpClient.socketTimeout:10000}")
    private Integer socketTimeout;
    /**
     * 连接超时时间
     */

    @Value("${httpClient.connectTimeout:10000}")
    private Integer connectTimeout;
    /**
     * 请求超时时间
     */

    @Value("${httpClient.connectionRequestTimeout:10000}")
    private Integer connectionRequestTimeout;

    /**
     * utf-8字符编码
     */


    public static final String CHARSET_UTF_8 = "utf-8";

    /**
     * HTTP内容类型。
     */

    public static final String CONTENT_TYPE_TEXT_HTML = "text/xml";

    /**
     * HTTP内容类型。相当于form表单的形式，提交数据
     */

    public static final String CONTENT_TYPE_FORM_URL = "application/x-www-form-urlencoded";

    /**
     * HTTP内容类型。相当于form表单的形式，提交数据
     */

    public static final String CONTENT_TYPE_JSON_URL = "application/json;charset=utf-8";


    /**
     * 连接管理器
     */

    private PoolingHttpClientConnectionManager pool;

    /**
     * 请求配置
     */

    private RequestConfig requestConfig;

    /**
     * 请求客户端
     */

    private CloseableHttpClient httpClient;

    @PostConstruct
    public void initHttpClient() {
        try {
            LogUtil.info("httpClient初始化");
            SSLContextBuilder builder = new SSLContextBuilder();
            builder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(builder.build());
            // 配置同时支持 HTTP 和 HTPPS
            Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create().register("http", PlainConnectionSocketFactory.getSocketFactory()).register("https", sslsf).build();
            // 初始化连接管理器
            pool = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
            // 将最大连接数增加到200，实际项目最好从配置文件中读取这个值
            pool.setMaxTotal(maxTotal);
            // 设置最大路由
            pool.setDefaultMaxPerRoute(2);
            // 根据默认超时限制初始化requestConfig
            requestConfig = RequestConfig.custom().setConnectionRequestTimeout(connectionRequestTimeout).setSocketTimeout(socketTimeout).setConnectTimeout(connectTimeout).build();

            httpClient = HttpClients.custom()
                // 设置连接池管理
                .setConnectionManager(pool)
                // 设置请求配置
                .setDefaultRequestConfig(requestConfig)
                // 设置重试次数
                .setRetryHandler(new DefaultHttpRequestRetryHandler(0, false)).build();
        } catch (NoSuchAlgorithmException e) {
            LogUtil.error(e, "初始化客户端请求异常");
        } catch (KeyStoreException e) {
            LogUtil.error(e, "初始化客户端请求异常");
        } catch (KeyManagementException e) {
            LogUtil.error(e, "初始化客户端请求异常");
        }
    }

    @PreDestroy
    public void destroy() {
        try {
            httpClient.close();
        } catch (IOException e) {
            LogUtil.error(e, "关闭httpClient异常");
        }
    }

    /**
     * 发送post请求
     *
     * @param url 请求地址
     * @param map 请求参数
     * @return 请求结果
     */

    public String sendPost(String url, Map<String, String> map) {
        HttpPost post = new HttpPost(url);
        if (map == null || map.isEmpty()) {
            return execute(post);
        }
        List<NameValuePair> list = new ArrayList<>(map.size());
        for (Entry<String, String> entry : map.entrySet()) {
            list.add(new BasicNameValuePair(StringUtil.defaultIfBlank(entry.getKey()), StringUtil.defaultIfBlank(entry.getValue())));
        }
        try {
            post.setEntity(new UrlEncodedFormEntity(list, CHARSET_UTF_8));
        } catch (UnsupportedEncodingException e) {
            LogUtil.error(e, "POST请求异常");
        }
        return execute(post);
    }

    /**
     * 发送get请求
     *
     * @param url 请求地址
     * @param map 请求参数
     * @return 请求结果
     */

    public String sendGet(String url, Map<String, String> map) {
        // 创建get请求
        HttpGet httpGet = map == null || map.isEmpty() ? new HttpGet(url) : new HttpGet(toURI(url, map));
        return execute(httpGet);
    }

    /**
     * 获取get请求response
     *
     * @param url url
     * @return CloseableHttpResponse
     */
    public CloseableHttpResponse getCloseableHttpResponseGet(String url) {

        HttpGet httpGet = new HttpGet(url);
        // 执行请求
        try {
            return httpClient.execute(httpGet);
        } catch (IOException e) {
            LogUtil.error(e, "请求失败");
        }
        return null;
    }

    /**
     * 获取响应entity
     *
     * @param request request
     * @return HttpEntity
     */
    private HttpEntity getHttpEntity(HttpUriRequest request) {

        CloseableHttpResponse response = null;
        try {
            // 执行请求
            response = httpClient.execute(request);
            // 得到响应实例
            HttpEntity entity = response.getEntity();
            // 判断响应状态
            if (response.getStatusLine().getStatusCode() >= 300) {
                throw new Exception("HTTP Request is not success, Response code is " + response.getStatusLine().getStatusCode());
            }
            if (HttpStatus.SC_OK == response.getStatusLine().getStatusCode()) {
                return entity;
            }
        } catch (Exception e) {
            LogUtil.error(e, "请求异常");
        } finally {
            try {
                // 释放资源
                if (response != null) {
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 执行请求
     *
     * @param request request
     * @return 请求结果
     */

    private String execute(HttpUriRequest request) {

        try {
            // 得到响应实例
            HttpEntity entity = getHttpEntity(request);
            if (entity == null) {
                throw new RuntimeException("请求失败");
            }
            return EntityUtils.toString(entity);
        } catch (Exception e) {
            LogUtil.error(e, "请求异常");
        }
        return null;
    }

    /**
     * 构建URI
     *
     * @param url 结果
     * @param params 参数
     * @return URI
     * @throws IllegalArgumentException 协议错误
     */

    private URI toURI(String url, Map<String, String> params) throws IllegalArgumentException {
        try {
            URIBuilder builder = new URIBuilder(url);
            for (Entry<String, String> entry : params.entrySet()) {
                builder.addParameter(entry.getKey(), StringUtil.defaultIfBlank(entry.getValue(), ""));
            }
            return builder.build();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException(e);
        }
    }
}
