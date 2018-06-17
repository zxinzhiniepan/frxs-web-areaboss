/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.promotion.service.api.dto.ActivityDto;
import com.frxs.promotion.service.api.dto.ActivityQueryDto;
import com.frxs.promotion.service.api.dto.PreproductDto;
import com.frxs.promotion.service.api.dto.consumer.ActivityDelDto;
import com.frxs.promotion.service.api.enums.AuditStatusEnum;
import com.frxs.promotion.service.api.facade.ActivityFacade;
import com.frxs.promotion.service.api.facade.ActivityPreproductFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import com.frxs.web.areaboss.dto.ActivityOpLogDto;
import com.frxs.web.areaboss.dto.ActivityWebDto;
import com.frxs.web.areaboss.dto.PreproductOpLogDto;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.BeanConvertUtils;
import com.frxs.web.areaboss.utils.IdsConverterUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author liudiwei
 * @version $Id: ActivityWebApiController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@RestController
@RequestMapping("/activity")
public class ActivityWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 60000)
    ActivityFacade activityFacade;

    @Reference(check = false,version = "1.0.0",timeout = 300000)
    ActivityPreproductFacade activityPreproductFacade;

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    OpLogFacade opLogFacade;

    /**
     * 活动展示列表
     *
     * @param query 活动查询DTO
     * @param page 分页参数
     * @param rows 分页参数
     */
    @RequestMapping(value = {"/queryActivityPage"})
    public Map queryActivityPage(HttpServletRequest request,ActivityQueryDto query,int page,int rows){
        Map resultMap = new HashMap();
        Page<ActivityDto> pageDto = new Page<>();
        pageDto.setCurrent(page);
        pageDto.setSize(rows);
        query.setAreaId(UserLoginInfoUtil.getRegionId(request));
        PromotionBaseResult<Page<ActivityDto>> pagePromotionBaseResult = null;
        pagePromotionBaseResult = activityFacade.queryActivityPage(query,pageDto);
        resultMap.put("rows", pagePromotionBaseResult.getData().getRecords());
        resultMap.put("total", pagePromotionBaseResult.getData().getTotal());
        return resultMap;
    }

    /**
     * 活动导出
     *
     * @param query 活动查询DTO
     *
     */
    @RequestMapping(value = {"/activityExport"})
    public List<PreproductDto> activityExport(HttpServletRequest request,ActivityQueryDto query){
        Page<PreproductDto> pageDto = new Page<>();
        pageDto.setCurrent(1);
        pageDto.setSize(Integer.MAX_VALUE);
        query.setAreaId(UserLoginInfoUtil.getRegionId(request));
        PromotionBaseResult<Page<PreproductDto>> pagePromotionBaseResult = null;
        pagePromotionBaseResult = activityPreproductFacade.queryBossPreproduct(query,pageDto);
        return pagePromotionBaseResult.getData().getRecords();
    }

    /**
     * 查询预售活动商品列表
     *
     * @param activityDto 活动DTO
     * @return 活动信息和预售商品信息
     */
    @RequestMapping(value = "/queryActivityDetail")
    public List<PreproductDto> presaleActivityDetails(ActivityDto  activityDto) {
        List<PreproductDto> preproductDtoList = null;
        PromotionBaseResult<ActivityDto> promotionBaseResult = null;
        promotionBaseResult = activityFacade.queryPreprocutActivityInfo(activityDto.getActivityId());
        if(promotionBaseResult.getData().getPreproductList()!=null&&promotionBaseResult.getData().getPreproductList().size()>0){
            preproductDtoList = promotionBaseResult.getData().getPreproductList();
        }
        return  preproductDtoList;
    }

    /**
     * 创建预售商品活动
     *
     */
    @RequestMapping(value = {"/addActivity"})
    public WebResult createPreproductActivity(HttpServletRequest request,ActivityWebDto saveData) {
        PromotionBaseResult promotionBaseResult = null;
        List<PreproductDto> preproductList = new ArrayList<>();
        ActivityDto activity = new ActivityDto();
        if(saveData!=null){
            activity.setActivityId(saveData.getActivityId());
            activity.setActivityName(saveData.getActivityName());
            activity.setActivityType(saveData.getActivityType());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            ParsePosition pos = new ParsePosition(0);
            activity.setTmBuyStart(formatter.parse(saveData.getTmBuyStart(),pos));
            ParsePosition posOne = new ParsePosition(0);
            activity.setTmBuyEnd(formatter.parse(saveData.getTmBuyEnd(),posOne));
            ParsePosition postwo = new ParsePosition(0);
            activity.setTmDisplayStart(formatter.parse(saveData.getTmDisplayStart(),postwo));
            ParsePosition posthree = new ParsePosition(0);
            activity.setTmDisplayEnd(formatter.parse(saveData.getTmDisplayEnd(),posthree));
            SimpleDateFormat formatterOne = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            ParsePosition posfour = new ParsePosition(0);
            activity.setTmPickUp(formatterOne.parse(saveData.getTmPickUp(),posfour));
            activity.setStatus(saveData.getStatus());
            activity.setActivityStatus(saveData.getActivityStatus());
            if(saveData.getPreproductArry()!=null&&!"".equals(saveData.getPreproductArry())){
                preproductList = JSON.parseArray(saveData.getPreproductArry(),PreproductDto.class);
            }
        }
        activity.setCreateUserId(UserLoginInfoUtil.getUserId(request));
        activity.setCreateUserName(UserLoginInfoUtil.getUserName(request));
        activity.setAreaId(UserLoginInfoUtil.getRegionId(request));
        activity.setTmCreate(new Date());

        promotionBaseResult = activityFacade.createPreproductActivity(activity,preproductList);
        OpLogDto opLogDto = new OpLogDto();
        ActivityOpLogDto activityOpLogDto = new ActivityOpLogDto();
        BeanConvertUtils.copyProperties(saveData,activityOpLogDto);
        List<PreproductOpLogDto> preproductOpLogDtoList = new ArrayList<>();
        if(preproductList!=null&&preproductList.size()>0){
            for(int i=0;i<preproductList.size();i++){
                PreproductOpLogDto preproductOpLogDto = new PreproductOpLogDto();
                BeanConvertUtils.copyProperties(preproductList.get(i),preproductOpLogDto);
                preproductOpLogDtoList.add(preproductOpLogDto);
            }
        }
        activityOpLogDto.setPreproductList(preproductOpLogDtoList);
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("95");
        opLogDto.setMenuName("2B活动管理");
        opLogDto.setAction("活动新增");
        if(activityOpLogDto!=null){
            opLogDto.setRemark(JSON.toJSONString(activityOpLogDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        WebResult webResult = new WebResult();
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("活动新增成功！");
        }else{
            ErrorContext errorContext1 = promotionBaseResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 修改预售商品活动
     * 一但活动是进行中（不管有没有审核）就不能移除活动中的商品
     *
     * @param saveData 活动信息
     */
    @RequestMapping(value = {"/updatePreproductActivity"})
    public WebResult updatePreproductActivity(HttpServletRequest request,ActivityWebDto saveData){
        PromotionBaseResult promotionBaseResult = null;
        List<PreproductDto> preproductList = new ArrayList<>();
        ActivityDto activity = new ActivityDto();
        if(saveData!=null){
            activity.setActivityId(saveData.getActivityId());
            activity.setActivityName(saveData.getActivityName());
            activity.setActivityType(saveData.getActivityType());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            ParsePosition pos = new ParsePosition(0);
            activity.setTmBuyStart(formatter.parse(saveData.getTmBuyStart(),pos));
            ParsePosition posOne = new ParsePosition(0);
            activity.setTmBuyEnd(formatter.parse(saveData.getTmBuyEnd(),posOne));
            ParsePosition postwo = new ParsePosition(0);
            activity.setTmDisplayStart(formatter.parse(saveData.getTmDisplayStart(),postwo));
            ParsePosition posthree = new ParsePosition(0);
            activity.setTmDisplayEnd(formatter.parse(saveData.getTmDisplayEnd(),posthree));
            SimpleDateFormat formatterOne = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            ParsePosition posfour = new ParsePosition(0);
            activity.setTmPickUp(formatterOne.parse(saveData.getTmPickUp(),posfour));
            activity.setStatus(saveData.getStatus());
            activity.setActivityStatus(saveData.getActivityStatus());
            if(saveData.getPreproductArry()!=null&&!"".equals(saveData.getPreproductArry())){
                preproductList = JSON.parseArray(saveData.getPreproductArry(),PreproductDto.class);
            }
        }
        activity.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        activity.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        activity.setTmSmp(new Date());
        promotionBaseResult = activityFacade.updatePreproductActivity(activity,preproductList);
        OpLogDto opLogDto = new OpLogDto();
        ActivityOpLogDto activityOpLogDto = new ActivityOpLogDto();
        BeanConvertUtils.copyProperties(saveData,activityOpLogDto);
        List<PreproductOpLogDto> preproductOpLogDtoList = new ArrayList<>();
        if(preproductList!=null&&preproductList.size()>0){
            for(int i=0;i<preproductList.size();i++){
                PreproductOpLogDto preproductOpLogDto = new PreproductOpLogDto();
                BeanConvertUtils.copyProperties(preproductList.get(i),preproductOpLogDto);
                preproductOpLogDtoList.add(preproductOpLogDto);
            }
        }
        activityOpLogDto.setPreproductList(preproductOpLogDtoList);
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("95");
        opLogDto.setMenuName("2B活动管理");
        opLogDto.setAction("活动修改");
        if(activityOpLogDto!=null){
            opLogDto.setRemark(JSON.toJSONString(activityOpLogDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        WebResult webResult = new WebResult();
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("活动编辑成功！");
        }else{
            ErrorContext errorContext1 = promotionBaseResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 修改预售活动商品
     *
     * @param saveData 活动Dto
     */
    @RequestMapping(value = {"/updatePreproduct"})
    public WebResult updatePreproduct(HttpServletRequest request,ActivityWebDto saveData){
        PromotionBaseResult promotionBaseResult = null;
        List<PreproductDto> preproductList = new ArrayList<>();
        ActivityDto activity = new ActivityDto();
        if(saveData!=null){
            activity.setActivityId(saveData.getActivityId());
            if(saveData.getPreproductArry()!=null&&!"".equals(saveData.getPreproductArry())){
                preproductList = JSON.parseArray(saveData.getPreproductArry(),PreproductDto.class);
            }
        }
        activity.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        activity.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        activity.setTmSmp(new Date());
        promotionBaseResult = activityFacade.updatePreproduct(activity,preproductList);
        OpLogDto opLogDto = new OpLogDto();
        ActivityOpLogDto activityOpLogDto = new ActivityOpLogDto();
        BeanConvertUtils.copyProperties(saveData,activityOpLogDto);
        List<PreproductOpLogDto> preproductOpLogDtoList = new ArrayList<>();
        if(preproductList!=null&&preproductList.size()>0){
            for(int i=0;i<preproductList.size();i++){
                PreproductOpLogDto preproductOpLogDto = new PreproductOpLogDto();
                BeanConvertUtils.copyProperties(preproductList.get(i),preproductOpLogDto);
                preproductOpLogDtoList.add(preproductOpLogDto);
            }
        }
        activityOpLogDto.setPreproductList(preproductOpLogDtoList);
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("95");
        opLogDto.setMenuName("2B活动管理");
        opLogDto.setAction("活动商品修改");
        if(activityOpLogDto!=null){
            opLogDto.setRemark(JSON.toJSONString(activityOpLogDto));
        }

        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        WebResult webResult = new WebResult();
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("活动商品修改成功！");
        }else{
            ErrorContext errorContext1 = promotionBaseResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 审核预售活动
     *
     * @param activityDto 活动Dto 活动id ,审核状态：PENDING-待审核（反审核），PASS-审核通过，REJECT-驳回
     */
    @RequestMapping(value = {"/auditPreproductActivity"})
    public WebResult auditPreproductActivity(HttpServletRequest request,ActivityDto activityDto){
        PromotionBaseResult<ActivityDto> promotionBaseResult = null;
        if(activityDto!=null&&activityDto.getStatus()!=null&&!"".equals(activityDto.getStatus())){
            if(activityDto.getStatus().equals("1")){
                activityDto.setStatus(AuditStatusEnum.PASS.getValue().toString());
            }else {
                activityDto.setStatus(AuditStatusEnum.PENDING.getValue().toString());
            }
        }
        activityDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        activityDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        activityDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        activityDto.setAuditUserId(UserLoginInfoUtil.getUserId(request));
        activityDto.setAuditUserName(UserLoginInfoUtil.getUserName(request));
        promotionBaseResult = activityFacade.auditPreproductActivity(activityDto);

        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("95");
        opLogDto.setMenuName("2B活动管理");
        Map map = new HashMap();
        map.put("审核人",UserLoginInfoUtil.getUserName(request));
        map.put("审核人ID",UserLoginInfoUtil.getUserId(request));
        if(AuditStatusEnum.PASS.getValue().equals(activityDto.getStatus())){
            opLogDto.setAction("活动审核");
            map.put("操作","活动审核");
        }else {
            opLogDto.setAction("活动反审核");
            map.put("操作","活动反审核");
        }
        opLogDto.setRemark(map.toString());
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);

        WebResult webResult = new WebResult();
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            if(AuditStatusEnum.PASS.getValue().equals(activityDto.getStatus())){
                webResult.setRspDesc("审核成功！");
            }else {
                webResult.setRspDesc("反审核成功！");
            }
        }else{
            webResult.setRspCode(ResponseCode.FAILED);
            ErrorContext errorContext1 = promotionBaseResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 删除活动
     * 校验规则： 只能在活动购买时间开始前才能删除。
     */
    @RequestMapping(value = {"/delActivity"})
    public WebResult delActivity(String ids,HttpServletRequest request){
        PromotionBaseResult promotionBaseResult = null;
        ActivityDelDto activityDelDto = new ActivityDelDto();
        List<Long> idList = IdsConverterUtil.IdsConverter(ids);
        activityDelDto.setActivityIds(idList);
        activityDelDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        activityDelDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        activityDelDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        promotionBaseResult = activityFacade.delActivity(activityDelDto);
        WebResult webResult = new WebResult();
        if(promotionBaseResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("活动删除成功！");
        }else{
            ErrorContext errorContext1 = promotionBaseResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }
}