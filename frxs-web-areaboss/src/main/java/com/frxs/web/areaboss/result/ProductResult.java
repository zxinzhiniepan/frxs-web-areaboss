/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.result;

import com.frxs.framework.web.domain.BaseWebResult;

import java.io.Serializable;

import com.frxs.merchant.service.api.dto.ProductDto;
import lombok.Data;
import com.baomidou.mybatisplus.plugins.Page;

/**
 *  ProductResult  web页面返回结果类
 *
 * @author liudiwei
 * @version $Id: ProductResult.java,v 0.1 2018年01月02日 下午 19:40 $Exp
 */
@Data
public class ProductResult extends BaseWebResult implements Serializable{

    /**
     *  serialVersionUID
     */
    private static final long serialVersionUID = 6606210894441475458L;

    /**
     *  USER API  DTO
     */
    private ProductDto productDto;
    /**
     *  USER page
     */
    private Page<ProductDto> page;
}
