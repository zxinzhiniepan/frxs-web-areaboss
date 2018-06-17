/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */
package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSONArray;
import com.frxs.promotion.service.api.dto.ActivityPreproductQueryDto;
import com.frxs.promotion.service.api.dto.ActivityPreproductSortDto;
import com.frxs.promotion.service.api.facade.ActivityPreproductFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wuwu
 * @version $Id: ProductSortWebApiController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@RestController
@RequestMapping("/productSort")
public class ProductSortWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    ActivityPreproductFacade activityPreproductFacade;

    /**
     * 获取商品信息
     */
    @RequestMapping(value = {"/getProductSort"}, method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> getProductSorts(ActivityPreproductQueryDto activityPreproductQueryDto, HttpServletRequest request) {
        PromotionBaseResult<List<ActivityPreproductSortDto>> promotionBaseResult = null;
        activityPreproductQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        promotionBaseResult = activityPreproductFacade
            .findActivityPreproductSortDtoList(activityPreproductQueryDto);
        Map<String, Object> map = new HashMap<>();
        map.put("rows", promotionBaseResult.getData());
        map.put("total", promotionBaseResult.getData().size());
        return map;
    }

    /**
     * 商品排序导出
     */
    @RequestMapping(value = {"/productSortsExport"}, method = {RequestMethod.GET, RequestMethod.POST})
    public List<ActivityPreproductSortDto> productSortsExport(ActivityPreproductQueryDto activityPreproductQueryDto, HttpServletRequest request) {
        PromotionBaseResult<List<ActivityPreproductSortDto>> promotionBaseResult = null;
        activityPreproductQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        promotionBaseResult = activityPreproductFacade.findActivityPreproductSortDtoList(activityPreproductQueryDto);
        return promotionBaseResult.getData();
    }

    /**
     * 保存单个字段信息
     */
    @RequestMapping(value = {"/saveProductSort"}, method = {RequestMethod.GET, RequestMethod.POST})
    public WebResult saveProductSorts(String activityPreproduct) {
        PromotionBaseResult promotionBaseResult = null;
        WebResult webResult = new WebResult();
        List<ActivityPreproductSortDto> reqList = (List<ActivityPreproductSortDto>)
            JSONArray.parseArray(activityPreproduct, ActivityPreproductSortDto.class);
        promotionBaseResult = activityPreproductFacade.updateActivityPreproductSort(reqList);
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("显示顺序修改成功");
        }else{
            //失败
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("显示顺序修改失败");
        }
        return webResult;
    }

}
