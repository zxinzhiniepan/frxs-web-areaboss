package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.merchant.service.api.facade.VendorTypeFacade;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * <p>供应商类型</p>
 *
 * @author wushuo
 * @version $Id: VendorType.java,v 0.1 2018年01月25日 20:06 $Exp
 */

@Controller
@RequestMapping("/vendorType")
public class VendorTypeController {

    //@Reference
    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private VendorTypeFacade vendorTypeFacade;

    /**
     * 编辑供应商类型
     * @param map
     * @param vendorTypeName
     * @return
     */
    @RequestMapping(value = "/editVendorType",method = RequestMethod.GET)
    public String editVendorType(ModelMap map,String vendorTypeName){
        //vendorTypeFacade.
        map.addAttribute("vendorTypeName",vendorTypeName);
        return "vendor/editVendorType";
    }

}
