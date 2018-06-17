/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */
package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.promotion.service.api.dto.AuditOnlineImgDto;
import com.frxs.promotion.service.api.dto.OnlineImgtextDto;
import com.frxs.promotion.service.api.dto.OnlineImgtextQueryDto;
import com.frxs.promotion.service.api.facade.OnlineImgtextFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.IdsConverterUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wuwu
 * @version $Id: TeletextWebApiController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@RestController
@RequestMapping("/teletext")
public class TeletextWebApiController {

    @Reference(check = false,version = "1.0.0")
    OnlineImgtextFacade onlineImgtextFacade;


    /**
     * 分页查询图文直播
     *
     * @return 图文直播数量
     */
    @RequestMapping(value = "/getPageList",method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
   public Map<String,Object> getPageList(OnlineImgtextQueryDto onlineImgtextQueryDto, int page,int rows){
        Map<String,Object> map = new HashMap<>();
        PromotionBaseResult<Page<OnlineImgtextDto>> pagePromotionBaseResult = null;
        Page<OnlineImgtextDto> pageDto = new Page<>();
        pageDto.setCurrent(page);
        pageDto.setSize(rows);
        pagePromotionBaseResult = onlineImgtextFacade.queryOnlineImgtextDtoList(onlineImgtextQueryDto,pageDto );
        map.put("rows",pagePromotionBaseResult.getData().getRecords());
        map.put("total",pagePromotionBaseResult.getData().getTotal());
        return map;
   }

    /**
     * 删除图文直播
     * 只有过期的才能删除
     *
     *
     */
   @RequestMapping(value = "/teletextDelete", method = {RequestMethod.GET, RequestMethod.POST})
   @ResponseBody
   public WebResult teletextDelete(String ids,HttpServletRequest request){
       PromotionBaseResult promotionBaseResult = null;
       WebResult webResult = new WebResult();
       List<OnlineImgtextDto> onlineImgtextDtoList = new ArrayList<>();
       long usrId = UserLoginInfoUtil.getUserId(request);
       String userName = UserLoginInfoUtil.getUserName(request);

       List<Long> idList = IdsConverterUtil.IdsConverter(ids);
       for(Long id : idList){
           OnlineImgtextDto onlineImgtextDto = new OnlineImgtextDto();
           onlineImgtextDto.setImgtextId(id);
           onlineImgtextDto.setModifyUserId(usrId);
           onlineImgtextDto.setModifyUserName(userName);
           onlineImgtextDtoList.add(onlineImgtextDto);
       }

       promotionBaseResult = onlineImgtextFacade.deleteOnlineImgtext(onlineImgtextDtoList);
       if(promotionBaseResult.isSuccess()){
           webResult.setRspCode(ResponseCode.SUCCESS);
           webResult.setRspDesc("删除成功");
       }else{
           //失败
           webResult.setRspCode(ResponseCode.FAILED);
           webResult.setRspDesc("删除失败");
       }
       return webResult;
   }

    /**
     * 驳回审核操作
     */
    @RequestMapping(value = "/teletextAudit", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public WebResult teletextAudit (Long imgtextId,String imgIds,String imgTextStatus,HttpServletRequest request){
        WebResult webResult = new WebResult();
        PromotionBaseResult promotionBaseResult = null;
        AuditOnlineImgDto auditOnlineImgDto = new AuditOnlineImgDto();
        String ids [] = imgIds.split(",");
        List<Long> imgId = new ArrayList<>();
        for(int i = 0;i<ids.length;i++){
            imgId.add(Long.parseLong(ids[i]));
        }
        auditOnlineImgDto.setImgIds(imgId);
        auditOnlineImgDto.setImgtextId(imgtextId);
        auditOnlineImgDto.setImgTextAuditStatus(imgTextStatus);
        auditOnlineImgDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        auditOnlineImgDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        promotionBaseResult = onlineImgtextFacade.auditOnlineImg(auditOnlineImgDto);
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("驳回操作成功");
        }else{
            //失败
            ErrorContext errorContext1 = promotionBaseResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }
}
