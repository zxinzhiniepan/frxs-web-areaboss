/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */
package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.promotion.service.api.dto.OnlineImgtextDto;
import com.frxs.promotion.service.api.facade.OnlineImgtextFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import org.springframework.stereotype.Controller;

import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author wuwu
 * @version $Id: TeletextController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@Controller
@RequestMapping("/teletextWeb")
public class TeletextController {

    @Reference(check = false,version = "1.0.0")
    OnlineImgtextFacade onlineImgtextFacade;

    /**
     * 查看图文直播详情与审核页面
     *
     * @param imgtextId 图文直播id
     * @return 图文直播详情
     */
    @RequestMapping(value = "teletextDetails",  method = {RequestMethod.GET, RequestMethod.POST})
    public String teletextDetails(Long imgtextId, ModelMap map) {
            PromotionBaseResult<OnlineImgtextDto> promotionBaseResult = null;
            promotionBaseResult =  onlineImgtextFacade.queryOnlineImgtextInfo(imgtextId);
            map.addAttribute("online",promotionBaseResult.getData());
        return "marketing/teletextDetails";
    }
}
