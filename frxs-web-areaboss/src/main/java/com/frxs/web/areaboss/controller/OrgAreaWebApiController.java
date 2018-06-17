package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.merchant.service.api.dto.OrgAreaDto;
import com.frxs.merchant.service.api.facade.OrgAreaFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author liudiwei
 * @version $Id: OrgAreaWebApiController.java,v 0.1 2018年02月6日 下午 14:06 $Exp
 */
@RestController
@RequestMapping("/orgArea")
public class OrgAreaWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 6000)
    OrgAreaFacade orgAreaFacade;

    @RequestMapping(value = {"/getByParentId"})
    public List<OrgAreaDto> getByParentId(OrgAreaDto orgAreaDto){
        List<OrgAreaDto> orgAreaDtoList = null;
        MerchantResult<List<OrgAreaDto>> merchantResult = null;
        merchantResult = orgAreaFacade.getByParentId(orgAreaDto.getParentId());
        if(merchantResult.getData()!=null&&merchantResult.getData().size()>0){
            orgAreaDtoList = merchantResult.getData();
        }
        return orgAreaDtoList;
    }
}
