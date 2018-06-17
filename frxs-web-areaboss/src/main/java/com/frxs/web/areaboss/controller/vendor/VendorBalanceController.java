package com.frxs.web.areaboss.controller.vendor;


import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.fund.service.api.domain.dto.vendor.VendorBalanceQueryDto;
import com.frxs.fund.service.api.domain.request.vendor.VendorBalanceRequest;
import com.frxs.fund.service.api.domain.result.vendor.VendorBalanceResult;
import com.frxs.fund.service.api.facade.vendor.VendorBalanceFacade;

import com.frxs.sso.sso.SessionUser;
import com.frxs.sso.sso.SessionUtils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author wang.zhen
 * @version $Id: TradeController.java,v 0.1 2018年02月07日 18:41 $Exp
 */


@Controller
@RequestMapping("")
public class VendorBalanceController {
    @Reference(check = false,version = "1.0.0",timeout = 60000)
    private VendorBalanceFacade vendorBalanceFacade;

    @RequestMapping(value="/report/getVendorBalanceAmountList")
    @ResponseBody
    public Map getVendorBalanceAmountList(VendorBalanceRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        try{
            Page page1=new Page(request.getPage(),request.getRows());
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            VendorBalanceResult result= vendorBalanceFacade.queryVendorBalancePage(page1,request);
            resultMap.put("rows",result.getVendorBalanceDtos());
            resultMap.put("total",result.getTotal());
            VendorBalanceResult result1=vendorBalanceFacade.sumVendor(request);
            List  list=new ArrayList<>();
            if(result1!=null && result1.getVendorBalanceDto()!=null){
                VendorBalanceQueryDto vendorBalanceDto =  result1.getVendorBalanceDto();
                vendorBalanceDto.setVendorName("合计");
                list.add(vendorBalanceDto);
            }
            resultMap.put("footer",list);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

     /**
      *
     * 导出明细
     * @param
    */
    @RequestMapping(value="/vendor/downloadVendorBalanceAmountList", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<VendorBalanceQueryDto> exportBalanceDetail(VendorBalanceRequest request,HttpServletRequest request2){
        List<VendorBalanceQueryDto> resultList=null;
        try {
            Page page1 = new Page(1, Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            VendorBalanceResult result = vendorBalanceFacade.queryVendorBalancePage(page1, request);
            VendorBalanceResult result1 = vendorBalanceFacade.sumVendor(request);
            resultList = result.getVendorBalanceDtos();
            VendorBalanceQueryDto vendorBalanceDto = result1.getVendorBalanceDto();
            if(vendorBalanceDto!=null){
                vendorBalanceDto.setVendorName("合计");
                resultList.add(vendorBalanceDto);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultList;
    }

}
