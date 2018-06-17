/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.promotion.service.api.dto.SmsDto;
import com.frxs.promotion.service.api.dto.SmsQueryDto;
import com.frxs.promotion.service.api.facade.SmsFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author liudiwei
 * @version $Id: SmsWebApiController.java,v 0.1 2018年1月31日 18:39 $Exp
 */
@RestController
@RequestMapping("/sms")
public class SmsWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    SmsFacade smsFacade;

    /**
     * 短信列表查询
     *
     * @param smsQueryDto 短信查询Dto
     * @param page 分页数
     * @param rows 分页大小
     * @return resultMap
     */
    @RequestMapping(value = {"/getSmsList"})
    public Map getSmsList(HttpServletRequest request,SmsQueryDto smsQueryDto,int page,int rows){
        Map resultMap = new HashMap();
        PromotionBaseResult<Page<SmsDto>> pagePromotionBaseResult = null;
        Page<SmsDto> pageDto = new Page<>();
        pageDto.setCurrent(page);
        pageDto.setSize(rows);
        smsQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        pagePromotionBaseResult = smsFacade.smsList(smsQueryDto, pageDto);
        resultMap.put("rows",pagePromotionBaseResult.getData().getRecords());
        resultMap.put("total",pagePromotionBaseResult.getData().getTotal());
        return resultMap;
    }
}
