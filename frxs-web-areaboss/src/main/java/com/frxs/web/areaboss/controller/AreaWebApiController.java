package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.merchant.service.api.dto.AreaDto;
import com.frxs.merchant.service.api.facade.AreaFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.enums.IsDeleteEnum;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 区域
 * @author wushuo
 * @version $Id: AreaController.java,v 0.1 2018年02月06日 15:37 $Exp
 */
@RestController
@RequestMapping("/area/")
public class AreaWebApiController {

    @Reference(check = false,version = "1.0.0")
    AreaFacade areaFacade;

    /**
     * 查询所有的区域
     * @return
     */
    @RequestMapping(value = "getList",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public List<AreaDto> getAllList(){
        MerchantResult<List<AreaDto>> result = areaFacade
            .getList(IsDeleteEnum.IS_DELETE_N.getValueDefined());
        return result.getData();
    }
}
