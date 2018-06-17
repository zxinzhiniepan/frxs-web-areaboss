package com.frxs.web.areaboss.controller.systemmanagement;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.dto.ParameterSettingDto;
import com.frxs.merchant.service.api.dto.SetActivityDynamicPromptDto;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.merchant.service.api.facade.ParameterSettingFacade;
import com.frxs.merchant.service.api.facade.SetActivityDynamicPromptFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author jiangboxuan
 * @version SystemManagementController.java, v1.0
 * @create 2018/1/24 0024  下午 14:24
 */
@Controller
public class SystemManagementController {

    @Autowired
    HttpServletRequest request;

    @Reference(check = false,version = "1.0.0",timeout = 60000)
    //@Reference(check = false, url = "dubbo://192.168.8.25:8216",version = "1.0.0",timeout = 300000)
    private SetActivityDynamicPromptFacade setActivityDynamicPromptFacade;

    @Reference(check = false,version = "1.0.0",timeout = 60000)
    //@Reference(check = false, url = "dubbo://192.168.8.25:8216",version = "1.0.0",timeout = 300000)
    private ParameterSettingFacade parameterSettingFacade;

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    private OpLogFacade opLogFacade;

    //9B 活动动态提示设置
    @RequestMapping(value = {"/systemManagement/setActivityDynamicPrompt"}, method = RequestMethod.GET)
    public String setActivityDynamicPrompt(ModelMap map) {
        return "systemManagement/setActivityDynamicPrompt";
    }

    //9C 系统参数管理
    @RequestMapping(value = {"/systemManagement/parameterSettingsList"}, method = RequestMethod.GET)
    public String parameterSettingsList(ModelMap map) {
        return "systemManagement/parameterSettingsList";
    }

    //9B活动动态提示设置  编辑按钮
    @RequestMapping(value = "/setActivityDynamicPrompt/editDynamicPrompt", method = {RequestMethod.GET, RequestMethod.POST})
    public String editDynamicPrompt(Integer id,ModelMap model){
        if(id!=0){
            SetActivityDynamicPromptDto setActivityDto = new SetActivityDynamicPromptDto();
            MerchantResult<SetActivityDynamicPromptDto> merchantResult =
                setActivityDynamicPromptFacade.getSetActivityDynamicPromptDto(id);
            setActivityDto = merchantResult.getData();
            model.addAttribute("dto",setActivityDto);
        }
        return "systemManagement/editDynamicPrompt";
    }
    //9B活动动态提示设置  查询
    @RequestMapping(value = "/setActivityDynamicPrompt/getPageList", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map<String,Object> getPageList(SetActivityDynamicPromptDto setActivityDynamicPromptDto,Integer page,Integer rows){
        Map<String,Object> resultMap = new HashMap<String, Object>();
        setActivityDynamicPromptDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        MerchantResult<Page<SetActivityDynamicPromptDto>> merchantResult = setActivityDynamicPromptFacade.listSetActivityDynamicPrompt(setActivityDynamicPromptDto,page,rows);
        Page<SetActivityDynamicPromptDto> res = new Page<SetActivityDynamicPromptDto>();
        res = merchantResult.getData();
        List<SetActivityDynamicPromptDto> setActivityDynamicPromptDtoList = res.getRecords();
        resultMap.put("rows",setActivityDynamicPromptDtoList);
        resultMap.put("total",res.getTotal());
        return resultMap;
    }


    //9B活动动态提示设置 删除活动
    @RequestMapping(value = "/setActivityDynamicPrompt/deleteDynamicPrompt", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public WebResult deleteDynamicPrompt(SetActivityDynamicPromptDto setActivityDynamicPromptDto){
        WebResult webResult = new WebResult();
        setActivityDynamicPromptDto.setStatus(StatusEnum.DELETE.getValueDefined());
        MerchantResult merchantResult =
            setActivityDynamicPromptFacade.modifyState(setActivityDynamicPromptDto);

        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("101");
        opLogDto.setMenuName("活动动态提示设置管理模块");
        opLogDto.setAction("活动动态提示设置手动删除");
        if (setActivityDynamicPromptDto != null){
            opLogDto.setRemark(JSON.toJSONString(setActivityDynamicPromptDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("删除成功");
        }else{
            //失败
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }
    //9B活动动态提示设置 修改活动状态
    @RequestMapping(value = "/setActivityDynamicPrompt/upStatusDynamicPrompt", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public WebResult upStatusDynamicPrompt(SetActivityDynamicPromptDto setActivityDynamicPromptDto){
        WebResult webResult = new WebResult();
        if(StatusEnum.NORMAL.getValueDefined().equals(setActivityDynamicPromptDto.getStatus())){
            SetActivityDynamicPromptDto setActivityDynamicPromptDto1 = setActivityDynamicPromptFacade.getSetActivityDynamicPromptDto(setActivityDynamicPromptDto.getDynamicPromptId()).getData();
            List<SetActivityDynamicPromptDto> data = setActivityDynamicPromptFacade.listSetActivityDynamicPromptByTimePeriod(setActivityDynamicPromptDto1).getData();
            if(data.size()>0){
                if(setActivityDynamicPromptDto.getDynamicPromptId()==null){
                    webResult.setRspCode(ResponseCode.FAILED);
                    webResult.setRspDesc("该时间段已有活动提示");
                    return webResult;
                }else {
                    for (SetActivityDynamicPromptDto setActivityDynamicPromptDtoObj : data){
                        if(!setActivityDynamicPromptDto.getDynamicPromptId().equals(setActivityDynamicPromptDtoObj.getDynamicPromptId())){
                            webResult.setRspCode(ResponseCode.FAILED);
                            webResult.setRspDesc("该时间段已有活动提示");
                            return webResult;
                        }
                    }
                }
            }
        }

        MerchantResult merchantResult =
            setActivityDynamicPromptFacade.modifyState(setActivityDynamicPromptDto);
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("101");
        opLogDto.setMenuName("活动动态提示设置管理模块");
        opLogDto.setAction("活动动态提示设置状态修改");
        if (setActivityDynamicPromptDto != null){
            opLogDto.setRemark(JSON.toJSONString(setActivityDynamicPromptDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("修改成功");
        }else{
            //失败
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    //9C系统参数管理
    @RequestMapping(value = "/parameterSettings/getParameterSettingsList", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map<String,Object> getParameterSettingsList(ParameterSettingDto parameterSettingDto, Integer page, Integer rows){
        Map<String,Object> resultMap = new HashMap<String, Object>();
        parameterSettingDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        MerchantResult<Page<ParameterSettingDto>> merchantResult = parameterSettingFacade.listParameterSettingArea(parameterSettingDto,page,rows);
        Page<ParameterSettingDto> res = new Page<ParameterSettingDto>();
        res = merchantResult.getData();
        List<ParameterSettingDto> parameterSettingDtoList = res.getRecords();
        resultMap.put("rows",parameterSettingDtoList);
        resultMap.put("total",res.getTotal());
        return resultMap;
    }

    //9C系统参数管理  修改
    @RequestMapping(value = "/parameterSettings/updateParameterSettings", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public WebResult updateParameterSettings(ParameterSettingDto parameterSettingDto){
        WebResult webResult = new WebResult();
        MerchantResult merchantResult =
            parameterSettingFacade.modifyState(parameterSettingDto);
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("102");
        opLogDto.setMenuName("系统参数管理模块");
        opLogDto.setAction("系统参数状态修改");
        if (parameterSettingDto != null){
            opLogDto.setRemark(JSON.toJSONString(parameterSettingDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("修改成功");
        }else{
            //失败
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    @RequestMapping(value = "/setActivityDynamicPrompt/saveDynamicPrompt", method = {RequestMethod.POST})
    @ResponseBody
    public WebResult saveDynamicPrompt(SetActivityDynamicPromptDto setActivityDynamicPromptDto){
        WebResult webResult = new WebResult();
        setActivityDynamicPromptDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        MerchantResult<SetActivityDynamicPromptDto> merchantResult =
            setActivityDynamicPromptFacade.saveSetActivityDynamicPromptDto(setActivityDynamicPromptDto);
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("101");
        opLogDto.setMenuName("活动动态提示设置管理模块");
        opLogDto.setAction("活动动态提示设置保存");
        if (setActivityDynamicPromptDto != null){
            opLogDto.setRemark(JSON.toJSONString(setActivityDynamicPromptDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("保存成功");
        }else{
            //失败
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }
}
