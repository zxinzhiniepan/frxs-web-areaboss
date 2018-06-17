/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.merchant.service.api.dto.ProductDto;
import com.frxs.merchant.service.api.facade.ProductFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;


/*
 * @author liudiwei
 * @version $Id: ProductController.java,v 0.1 2017年2月5日 18:39 $Exp
 */
@Controller
@RequestMapping("/productsWeb")
public class ProductController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    ProductFacade productFacade;

    /*
     * 商品编辑页面跳转
     */
    @RequestMapping(value = {"/editProducts"})
    public String editProducts(Long productId, ModelMap map) {
        MerchantResult<ProductDto> merchantResult = null;
        merchantResult = productFacade.queryProductDetail(productId);
        if(merchantResult.getData()!=null){
            map.addAttribute("productDto",merchantResult.getData());
        }
        return "products/editProducts";
    }

    /*
     * 商品新增页面跳转
     */
    @RequestMapping(value = {"/addProducts"})
    public String addProducts() {
        return "products/addProducts";
    }

}
