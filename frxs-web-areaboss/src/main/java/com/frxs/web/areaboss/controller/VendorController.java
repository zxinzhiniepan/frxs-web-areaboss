package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.merchant.service.api.domain.request.VendorAccountRequest;
import com.frxs.merchant.service.api.dto.VendorAccountDto;
import com.frxs.merchant.service.api.dto.VendorDto;
import com.frxs.merchant.service.api.dto.VendorTypeDto;
import com.frxs.merchant.service.api.facade.VendorAccountFacade;
import com.frxs.merchant.service.api.facade.VendorFacade;
import com.frxs.merchant.service.api.facade.VendorTypeFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.enums.IsDeleteEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * <p>供应商管理</p>
 *
 * @author wushuo
 * @version $Id: VendorWebController.java,v 0.1 2018年01月25日 9:31 $Exp
 */
@Controller
@RequestMapping("/vendor/")
public class VendorController {

    //@Reference(check = false, url = "dubbo://192.168.8.26:8216")
    @Reference(check = false,version = "1.0.0",timeout = 30000)
    private VendorFacade vendorFacade;

    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private VendorTypeFacade vendorTypeFacade;

    //@Reference(check = false, url = "dubbo://192.168.8.26:8216")
    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private VendorAccountFacade vendorAccountFacade;

    /**
     * 主页面
     * @return String
     */
    @RequestMapping(value = "vendorList",method = {RequestMethod.POST,RequestMethod.GET})
    public String vendorList(){

        return "vendor/vendorList";
    }
    /**
     * 编辑页面数据回显
     * @param map
     * @param id
     * @return String
     */
    @GetMapping(value = "addVendor")
    public String addVendor(ModelMap map,Long id){
        if(id != 0){
            WebResult<VendorDto> result = new WebResult<>();
            MerchantResult<VendorDto> merchantResult = vendorFacade.getVendorById(id);
            if(merchantResult.isSuccess()){
                result.setRecord(merchantResult.getData());
                result.setRspCode(ResponseCode.SUCCESS);
                result.setRspDesc("find one vendor success");
            }
            VendorAccountRequest vendorAccountRequest = new VendorAccountRequest();
            vendorAccountRequest.setVendorId(id);
            MerchantResult<VendorAccountDto> facadeVendorAccount = vendorAccountFacade
                .getVendorAccount(vendorAccountRequest);
            if(facadeVendorAccount.isSuccess()){
                result.getRecord().setUserName(facadeVendorAccount.getData().getAccountNo());
            }
            map.addAttribute("result",result);
        }
        //供应商分类
        WebResult<List<VendorTypeDto>> vendorTypeResult = new  WebResult<>();
        VendorTypeDto vendorTypeDto = new VendorTypeDto();
        vendorTypeDto.setIsDeleted(IsDeleteEnum.IS_DELETE_N.getValueDefined());
        MerchantResult<List<VendorTypeDto>> merchantResult = vendorTypeFacade.getList(vendorTypeDto);
        if(merchantResult.isSuccess()){
            vendorTypeResult.setRecord(merchantResult.getData());
            vendorTypeResult.setRspCode(ResponseCode.SUCCESS);
            vendorTypeResult.setRspDesc("find one vendorType success");
        }
        map.addAttribute("vendorTypeResult",vendorTypeResult);
        return "vendor/addVendor";
    }
    /**
     * 供应商分类页面
     * @return
     */
    @RequestMapping(value = "vendorTypeManagement",method = {RequestMethod.POST,RequestMethod.GET})
    public String vendorTypeManagement(ModelMap map){
        WebResult<List<VendorTypeDto>> result = new WebResult<>();
        VendorTypeDto vendorTypeDto = new VendorTypeDto();
        vendorTypeDto.setIsDeleted(IsDeleteEnum.IS_DELETE_Y.getValueDefined());
        MerchantResult<List<VendorTypeDto>> merchantResult = vendorTypeFacade.getList(vendorTypeDto);
        if(merchantResult.isSuccess()){
            result.setRecord(merchantResult.getData());
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("find one vendorType success");
        }
        map.addAttribute("result",result);
        return "vendorType/vendorTypeManagement";
    }
    /**
     * 编辑银行信息数据回填
     * @param id
     * @param map
     * @return
     */
    @RequestMapping(value = "getVendorBankInfo",method = {RequestMethod.POST,RequestMethod.GET})
    public String getVendorBankInfo(Long id,ModelMap map){
        if(id != 0){
            WebResult<VendorDto> result = new WebResult<>();
            MerchantResult<VendorDto> merchantResult = vendorFacade.getVendorById(id);
            if(merchantResult.isSuccess()){
                result.setRecord(merchantResult.getData());
                result.setRspCode(ResponseCode.SUCCESS);
                result.setRspDesc("find one vendor success");
            }
            map.addAttribute("result",result);
        }
        return "vendor/getVendorBankInfo";
    }
}