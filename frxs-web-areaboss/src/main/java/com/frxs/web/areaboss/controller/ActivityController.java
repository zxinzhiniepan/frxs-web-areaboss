/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.promotion.service.api.dto.ActivityDto;
import com.frxs.promotion.service.api.facade.ActivityFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author liudiwei
 * @version $Id: ActivityController.java,v 0.1 2017年2月5日 18:39 $Exp
 */
@Controller
@RequestMapping("/activityWeb")
public class ActivityController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    ActivityFacade activityFacade;

    @RequestMapping(value = "/presaleActivityList")
    public String presaleActivityList() {
        return "presaleActivity/presaleActivityList";
    }

    /**
     * 查询预售活动详情
     *
     * @param id 活动id
     * @return 活动信息和预售商品信息
     */
    @RequestMapping(value = "/presaleActivityDetails")
    public String presaleActivityDetails(ModelMap map,Long  id) {
        PromotionBaseResult<ActivityDto> promotionBaseResult = null;
        promotionBaseResult = activityFacade.queryPreprocutActivityInfo(id);
        map.addAttribute("activityDto",promotionBaseResult.getData());
        return "presaleActivity/presaleActivityDetails";
    }

    /*
     * 活动新增页面跳转
     */
    @RequestMapping(value = "/addPresaleActivity")
    public String addPresaleActivity() {
        return "presaleActivity/addPresaleActivity";
    }

    /*
     * 活动编辑页面跳转
     */
    @RequestMapping(value = "/editPresaleActivity")
    public String editPresaleActivity(ModelMap map,Long activityId) {
        PromotionBaseResult<ActivityDto>  promotionBaseResult = activityFacade.queryPreprocutActivityInfo(activityId);
        ActivityDto activityDto = promotionBaseResult.getData();
        if(activityDto!=null){
            if(activityDto.getTmBuyStart().compareTo(activityDto.getTmDisplayStart())==0&&activityDto.getTmBuyEnd().compareTo(activityDto.getTmDisplayEnd())==0){
                activityDto.setTmDisplayStart(null);
                activityDto.setTmDisplayEnd(null);
            }
        }
        map.addAttribute("activityDto",promotionBaseResult.getData());
        return "presaleActivity/editPresaleActivity";
    }

    /*
     * 活动商品编辑页面跳转
     */
    @RequestMapping(value = "/editPresaleActivityProduct")
    public String editPresaleActivityProduct(ModelMap map,Long activityId) {
        PromotionBaseResult<ActivityDto>  promotionBaseResult = activityFacade.queryPreprocutActivityInfo(activityId);
        map.addAttribute("activityDto",promotionBaseResult.getData());
        return "presaleActivity/editPresaleActivityProduct";
    }
}
