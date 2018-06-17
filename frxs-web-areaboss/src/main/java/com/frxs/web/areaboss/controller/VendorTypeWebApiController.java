package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.dto.VendorTypeDto;
import com.frxs.merchant.service.api.enums.IsDeleteEnum;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.merchant.service.api.facade.VendorTypeFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wushuo
 * @version $Id: VendorTypeWebApiController.java,v 0.1 2018年02月06日 16:27 $Exp
 */
@RestController
@RequestMapping("/vendorType/")
public class VendorTypeWebApiController {
    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private VendorTypeFacade vendorTypeFacade;

    @Reference(check = false, version = "1.0.0",timeout = 3000)
    private OpLogFacade opLogFacade;

    /**
     * 保存供应商类型
     * @param vendorTypeDto
     * @return
     */
    @RequestMapping(value = "/saveVendorType",method = RequestMethod.POST)
    public WebResult<VendorTypeDto> saveVendorType(VendorTypeDto vendorTypeDto,HttpServletRequest request){
        WebResult<VendorTypeDto> result = new WebResult<>();
        //判断供应商分类名称是否存在
        MerchantResult<VendorTypeDto> vendorTypeByVendorTypeName = vendorTypeFacade
            .getVendorTypeByVendorTypeName(vendorTypeDto.getVendorTypeName());
        Integer vendorTypeId = vendorTypeDto.getVendorTypeId();
        if(vendorTypeId == null){
            if(vendorTypeByVendorTypeName.isSuccess()
                && IsDeleteEnum.IS_DELETE_N.getValueDefined().equals(vendorTypeByVendorTypeName.getData().getIsDeleted())){
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("供应商分类信息已存在！");
                return result;
            }
        }else {
            if(vendorTypeByVendorTypeName.isSuccess()
                && IsDeleteEnum.IS_DELETE_N.getValueDefined().equals(vendorTypeByVendorTypeName.getData().getIsDeleted())
                && !vendorTypeId.equals(vendorTypeByVendorTypeName.getData().getVendorTypeId())){
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("供应商分类信息已存在！");
                return result;
            }
        }
        if(vendorTypeByVendorTypeName.isSuccess() &&
            com.frxs.merchant.service.api.enums.IsDeleteEnum.IS_DELETE_Y.getValueDefined().equals(vendorTypeByVendorTypeName.getData().getIsDeleted())){
            VendorTypeDto data = vendorTypeByVendorTypeName.getData();
            data.setIsDeleted(com.frxs.merchant.service.api.enums.IsDeleteEnum.IS_DELETE_N.getValueDefined());
            data.setModifyUserId(UserLoginInfoUtil.getUserId(request));
            data.setModifyUserName(UserLoginInfoUtil.getUserName(request));
            MerchantResult merchantResult = vendorTypeFacade.save(data);
            if(merchantResult.isSuccess()){
                result.setRspCode(ResponseCode.SUCCESS);
                result.setRspDesc("保存成功！");
                return result;
            }else {
                ErrorContext errorContext = merchantResult.getErrorContext();
                result.setRspCode(errorContext.fetchCurrentErrorCode());
                result.setRspDesc("保存失败！");
                return result;
            }
        }
        vendorTypeDto.setIsDeleted(com.frxs.merchant.service.api.enums.IsDeleteEnum.IS_DELETE_N.getValueDefined());
        if(vendorTypeId == null ){
            vendorTypeDto.setCreateUserId(UserLoginInfoUtil.getUserId(request));
            vendorTypeDto.setCreateUserName(UserLoginInfoUtil.getUserName(request));
        }else {
            vendorTypeDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
            vendorTypeDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        }

        MerchantResult merchantResult = vendorTypeFacade.save(vendorTypeDto);

        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        if(vendorTypeId == null ){
            opLogDto.setAction("添加供应商分类");
        }else {
            opLogDto.setAction("编辑供应商分类");
        }
        opLogDto.setRemark(JSON.toJSONString(vendorTypeDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("保存成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc("保存失败！");
        }
        return result;
    }

    /**
     * 删除供应商类型
     * @param vendorTypeId
     * @return
     */
    @PostMapping(value = "vendorTypeDelete")
    public WebResult<VendorTypeDto> vendorTypeDelete(Integer vendorTypeId,HttpServletRequest request){
        WebResult<VendorTypeDto> result = new WebResult<>();
        //判断是否关联供应商
        MerchantResult vendorTypeRefMerchantResult = vendorTypeFacade
            .getVendorTypeRefListById(vendorTypeId);
        if(vendorTypeRefMerchantResult.isSuccess()){
            result.setRspCode(ResponseCode.FAILED);
            result.setRspDesc("该分类信息已关联供应商，无法删除！");
            return result;
        }
        VendorTypeDto vendorTypeDto = new VendorTypeDto();
        vendorTypeDto.setIsDeleted(com.frxs.merchant.service.api.enums.IsDeleteEnum.IS_DELETE_Y.getValueDefined());
        vendorTypeDto.setVendorTypeId(vendorTypeId);
        vendorTypeDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        vendorTypeDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        MerchantResult merchantResult = vendorTypeFacade.update(vendorTypeDto);
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("85");
        opLogDto.setMenuName("供应商管理");
        opLogDto.setAction("删除供应商分类");
        opLogDto.setRemark(JSON.toJSONString(vendorTypeDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("删除成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc("删除失败！");
        }
        return result;
    }

    /**
     * 所有供应商分类
     * @return
     */
    @PostMapping(value = "getAllList")
    public List<VendorTypeDto> getAllList(){
        VendorTypeDto vendorTypeDto = new VendorTypeDto();
        vendorTypeDto.setIsDeleted(com.frxs.merchant.service.api.enums.IsDeleteEnum.IS_DELETE_N.getValueDefined());
        MerchantResult<List<VendorTypeDto>> merchantResult = vendorTypeFacade.getList(vendorTypeDto);
        List<VendorTypeDto> result = null;
        if(merchantResult.isSuccess()){
            result = merchantResult.getData();
        }
        return result;
    }

    /**
     * 供应商分类回显
     * @return
     */
    @PostMapping(value = "vendorTypeIdList")
    public WebResult<List<Integer>> vendorTypeIdList(Long vendorId){
        MerchantResult<List<Integer>> merchantResult = vendorTypeFacade
            .getListByVendorId(vendorId, com.frxs.merchant.service.api.enums.IsDeleteEnum.IS_DELETE_N.getValueDefined());
        WebResult<List<Integer>> result = new WebResult<>();
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRecord(merchantResult.getData());
        }
        return result;
    }
}
