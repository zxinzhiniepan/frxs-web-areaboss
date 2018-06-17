package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.util.common.StringUtil;
import com.frxs.merchant.service.api.domain.request.VendorPageRequest;
import com.frxs.merchant.service.api.domain.request.VendorRequest;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.dto.VendorAccountDto;
import com.frxs.merchant.service.api.dto.VendorDto;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.merchant.service.api.facade.VendorAccountFacade;
import com.frxs.merchant.service.api.facade.VendorFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.CollectionUtils;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 供应商web api controller
 * @author wushuo
 * @version $Id: VendorWebApiController.java,v 0.1 2018年02月07日 9:55 $Exp
 */
@RestController
@RequestMapping("/vendor/")
public class VendorWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    private VendorFacade vendorFacade;

    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private VendorAccountFacade vendorAccountFacade;

    @Reference(check = false, version = "1.0.0",timeout = 3000)
    private OpLogFacade opLogFacade;

    /**
     * table分页
     * @param vendorPageRequest
     * @return Map<String,Object>
     */
    @RequestMapping(value = "getPageList",method = {RequestMethod.POST,RequestMethod.GET})
    public Map<String,Object> getPageList(VendorPageRequest vendorPageRequest,HttpServletRequest request){
        Map<String,Object> resultMap = new HashMap<String, Object>(16);
        //区域信息
        vendorPageRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        MerchantResult<Page<VendorDto>> merchantResult = vendorFacade
            .vendorPageList(vendorPageRequest);
        //详细地址
        List<VendorDto> vendorDtos = merchantResult.getData().getRecords();
        resultMap.put("total",merchantResult.getData().getTotal());
        resultMap.put("rows",vendorDtos);
        return resultMap;
    }
    /**
     * 删除供应商
     * @param vendorId
     * @return
     */
    @PostMapping(value = "vendorDelete")
    public WebResult vendorDelete(Long vendorId,String ids,HttpServletRequest request){
        MerchantResult merchantResult = null;
        WebResult result = new WebResult();
        String vendorStaus = StatusEnum.DELETE.getValueDefined();
        VendorDto vendorDto = new VendorDto();
        vendorDto.setVendorStatus(vendorStaus);
        vendorDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        vendorDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        if(ids != null){
            List<Long> vendorIds = CollectionUtils.strToLongList(ids);
            vendorDto.setVendorIds(vendorIds);
            merchantResult = vendorFacade.batchUpdateStatus(vendorDto);
        }else {
            vendorDto.setVendorId(vendorId);
            merchantResult = vendorFacade.updateVendor(vendorDto);
        }
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        opLogDto.setAction("删除供应商");
        opLogDto.setRemark(JSON.toJSONString(vendorDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("删除成功");
        }else {
            result.setRspCode(ResponseCode.FAILED);
            result.setRspDesc("您删除的供应商信息已绑定商品!");
        }
        return result;
    }

    /**
     * 锁定/解锁 供应商
     * @param status
     * @param ids
     * @param id
     * @return
     */
    @PostMapping(value = "vendorLock")
    public WebResult vendorLock(Integer status, Long id, String ids,HttpServletRequest request){
        String vendorStatus = null;
        if(status == 1){
            vendorStatus = StatusEnum.FROZEN.getValueDefined();
        }else if(status == 0){
            vendorStatus = StatusEnum.NORMAL.getValueDefined();;
        }

        WebResult result = new WebResult();
        MerchantResult merchantResult = null;
        VendorDto vendorDto = new VendorDto();
        vendorDto.setVendorStatus(vendorStatus);
        vendorDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        vendorDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        if(ids == null){
            vendorDto.setVendorId(id);
            merchantResult = vendorFacade.updateVendor(vendorDto);
        }else {
            List<Long> vendorIds = CollectionUtils.strToLongList(ids);
            vendorDto.setVendorIds(vendorIds);
            merchantResult = vendorFacade.batchUpdateStatus(vendorDto);
        }

        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        if(status == 1){
            opLogDto.setAction("冻结供应商");
        }else {
            opLogDto.setAction("解冻供应商");
        }
        opLogDto.setRemark(JSON.toJSONString(vendorDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("操作成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc("操作失败！");
        }
        return result;
    }
    /**
     * 编辑银行信息
     * @param vendorDto
     * @return
     */
    @PostMapping(value = "updateVendorBankInfo")
    public WebResult updateVendorBankInfo(VendorDto vendorDto,HttpServletRequest request){
        WebResult result = new WebResult();
        Long vendorId = vendorDto.getVendorId();
        VendorRequest vendorRequest = null;
        if(StringUtil.isNotBlank(vendorDto.getUnionPayCID())){
            //验证供企业用户号唯一性
            vendorRequest = new VendorRequest();
            vendorRequest.setUnionPayCID(vendorDto.getUnionPayCID());
            MerchantResult<List<VendorDto>> merchantResultByUnionPayCID = vendorFacade
                .getVendorListByVendorRequest(vendorRequest);
            if(merchantResultByUnionPayCID.isSuccess()){
                List<VendorDto> vendorDtoUnionPayCID = merchantResultByUnionPayCID.getData();
                if(vendorDtoUnionPayCID.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("企业用户号已存在，请重新填写！");
                    return result;
                }
                if(!vendorDtoUnionPayCID.get(0).getVendorId().equals(vendorId)){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("企业用户号已存在，请重新填写！");
                    return result;
                }
            }
        }

        if(StringUtil.isNotBlank(vendorDto.getUnionPayMID())){
            //验证银联商户号唯一性
            vendorRequest = new VendorRequest();
            vendorRequest.setUnionPayMID(vendorDto.getUnionPayMID());
            MerchantResult<List<VendorDto>> merchantResultByUnionPayMID = vendorFacade
                .getVendorListByVendorRequest(vendorRequest);
            if(merchantResultByUnionPayMID.isSuccess()){
                List<VendorDto> vendorDtoUnionPayMID = merchantResultByUnionPayMID.getData();
                if(vendorDtoUnionPayMID.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("银联商户号已存在，请重新填写！！");
                    return result;
                }
                if(!vendorDtoUnionPayMID.get(0).getVendorId().equals(vendorId)){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("银联商户号已存在，请重新填写！");
                    return result;
                }
            }
        }

        vendorDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        vendorDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        MerchantResult merchantResult = vendorFacade.saveOneVendor(vendorDto);

        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        opLogDto.setAction("更新银行信息");
        opLogDto.setRemark(JSON.toJSONString(vendorDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("修改成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc("修改失败！");
        }
        return  result;
    }
    /**
     * 保存供应商信息
     * @param vendorDto
     * @return
     */
    @PostMapping(value = "saveVendor")
    public WebResult saveVendor(VendorDto vendorDto,String vendorTypeId,HttpServletRequest request){
        WebResult result = new WebResult();
        Long vendorId = vendorDto.getVendorId();
        VendorRequest vendorRequest = new VendorRequest();
        //验证供应商编码唯一性
        if(vendorId ==0){
            vendorRequest.setVendorCode(vendorDto.getVendorCode());
            MerchantResult<List<VendorDto>> merchantResultByCode = vendorFacade
                .getVendorListByVendorRequest(vendorRequest);
            if(merchantResultByCode.isSuccess()){
                List<VendorDto> vendorDtoByCodes = merchantResultByCode.getData();
                if(vendorDtoByCodes.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("供应商编码已存在，请重新填写供应商编码！");
                    return result;
                }
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("供应商编码已存在，请重新填写供应商编码！");
                return result;
            }
        }
        //验证供应商名称唯一性
        vendorRequest = new VendorRequest();
        vendorRequest.setVendorName(vendorDto.getVendorName());
        MerchantResult<List<VendorDto>> merchantResultByName = vendorFacade
            .getVendorListByVendorRequest(vendorRequest);
        if(merchantResultByName.isSuccess()){
            List<VendorDto> vendorDtoByNames = merchantResultByName.getData();
            if(vendorId ==0){
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("供应商名称已存在，请重新填写供应商名称！");
                return result;
            }else {
                if(vendorDtoByNames.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("供应商名称已存在，请重新填写供应商名称！");
                    return result;
                }
                if(!vendorDtoByNames.get(0).getVendorId().equals(vendorId)){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("供应商名称已存在，请重新填写供应商名称！");
                    return result;
                }
            }
        }

        //验证供应商简称唯一性
        vendorRequest = new VendorRequest();
        vendorRequest.setVendorShortName(vendorDto.getVendorShortName());
        MerchantResult<List<VendorDto>> merchantResultByShortName = vendorFacade
            .getVendorListByVendorRequest(vendorRequest);
        if(merchantResultByShortName.isSuccess()){
            List<VendorDto> vendorDtoByShortNames = merchantResultByShortName.getData();
            if (vendorId == 0) {
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("供应商简称已存在，请重新填写供应商简称！");
                return result;
            } else {
                if(vendorDtoByShortNames.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("供应商简称已存在，请重新填写供应商简称！");
                    return result;
                }
                if (!vendorDtoByShortNames.get(0).getVendorId()
                    .equals(vendorId)) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("供应商简称已存在，请重新填写供应商简称！");
                    return result;
                }
            }
        }

        //验证供应账号唯一性
        /*if(vendorId ==0){
            VendorAccountRequest vendorAccountRequest = new VendorAccountRequest();
            vendorAccountRequest.setAccountNo(vendorDto.getUserName());

            MerchantResult<VendorAccountDto> facadeVendorAccount = vendorAccountFacade
                .getVendorAccount(vendorAccountRequest);
            VendorAccountDto vendorAccountDto = facadeVendorAccount.getData();
            if(vendorAccountDto != null){
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("供应商账户已存在，请重新填写！");
                return result;
            }
        }*/

        //验证供应联系电话唯一性
        vendorRequest = new VendorRequest();
        vendorRequest.setContactsTel(vendorDto.getContactsTel());
        MerchantResult<List<VendorDto>> merchantResultByContactsTel = vendorFacade
            .getVendorListByVendorRequest(vendorRequest);
        if(merchantResultByContactsTel.isSuccess()){
            List<VendorDto> vendorDtoContactsTels = merchantResultByContactsTel.getData();
            if(vendorId == 0){
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("联系电话已存在，请重新填写！");
                return result;
            }else {
                if(vendorDtoContactsTels.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("联系电话已存在，请重新填写！");
                    return result;
                }
                if(!vendorDtoContactsTels.get(0).getVendorId().equals(vendorId)){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("联系电话已存在，请重新填写！");
                    return result;
                }
            }

        }

        if(StringUtil.isNotBlank(vendorDto.getUnionPayCID())){
            //验证供企业用户号唯一性
            vendorRequest = new VendorRequest();
            vendorRequest.setUnionPayCID(vendorDto.getUnionPayCID());
            MerchantResult<List<VendorDto>> merchantResultByUnionPayCID = vendorFacade
                .getVendorListByVendorRequest(vendorRequest);
            if(merchantResultByUnionPayCID.isSuccess()){
                List<VendorDto> vendorDtoUnionPayCID = merchantResultByUnionPayCID.getData();
                if(vendorId == 0){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("企业用户号已存在，请重新填写！");
                    return result;
                }else {
                    if(vendorDtoUnionPayCID.size() > 1){
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("企业用户号已存在，请重新填写！");
                        return result;
                    }
                    if(!vendorDtoUnionPayCID.get(0).getVendorId().equals(vendorId)){
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("企业用户号已存在，请重新填写！");
                        return result;
                    }
                }
            }
        }

        if(StringUtil.isNotBlank(vendorDto.getUnionPayMID())){
            //验证银联商户号唯一性
            vendorRequest = new VendorRequest();
            vendorRequest.setUnionPayMID(vendorDto.getUnionPayMID());
            MerchantResult<List<VendorDto>> merchantResultByUnionPayMID = vendorFacade
                .getVendorListByVendorRequest(vendorRequest);
            if(merchantResultByUnionPayMID.isSuccess()){
                List<VendorDto> vendorDtoUnionPayMID = merchantResultByUnionPayMID.getData();
                if(vendorId == 0){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("银联商户号已存在，请重新填写！");
                    return result;
                }else {
                    if(vendorDtoUnionPayMID.size() > 1){
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("银联商户号已存在，请重新填写！");
                        return result;
                    }
                    if(!vendorDtoUnionPayMID.get(0).getVendorId().equals(vendorId)){
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("银联商户号已存在，请重新填写！");
                        return result;
                    }
                }
            }
        }

        //保存
        List<String> vendorTypeIdsStr = Arrays.asList(vendorTypeId.split(","));
        List<Integer> vendorTypeIds = CollectionUtils.strListToIntList(vendorTypeIdsStr);
        List<Integer> areaIds = new ArrayList<>();

        if(vendorDto.getVendorId() == 0){
            vendorDto.setCreateAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            vendorDto.setCreateUserId(UserLoginInfoUtil.getUserId(request));
            vendorDto.setCreateUserName(UserLoginInfoUtil.getUserName(request));
            areaIds.add(UserLoginInfoUtil.getRegionId(request).intValue());
        }else{
            vendorDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
            vendorDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        }

        MerchantResult merchantResult = vendorFacade.saveVendor(vendorDto,vendorTypeIds,areaIds);

        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        if(vendorDto.getVendorId() == 0){
            opLogDto.setAction("添加供应商");
        }else {
            opLogDto.setAction("编辑供应商");
        }

        opLogDto.setRemark(JSON.toJSONString(vendorDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);


        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("保存成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRecord(errorContext.fetchRootError());
            result.setRspDesc("保存失败！");
        }
        return  result;
    }

    /**
     * 重置密码
     * @param id
     * @return
     */
    @PostMapping(value = "vendorResetPwd")
    public WebResult resetPwd(Long id,HttpServletRequest request){
        WebResult result = new WebResult();
        VendorAccountDto vendorAccountDto = new VendorAccountDto();
        vendorAccountDto.setVendorId(id);
        vendorAccountDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        vendorAccountDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        MerchantResult<VendorAccountDto> merchantResult = vendorAccountFacade.resetPwd(vendorAccountDto);

        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        opLogDto.setAction("供应商重置密码");
        opLogDto.setRemark(JSON.toJSONString(vendorAccountDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("重置密码成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc("重置密码失败！");
        }
        return result;
    }
}