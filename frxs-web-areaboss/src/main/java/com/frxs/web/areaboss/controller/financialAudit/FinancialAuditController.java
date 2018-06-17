package com.frxs.web.areaboss.controller.financialAudit;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.fund.service.api.domain.result.withdraw.StoreWithdrawDetailResult;
import com.frxs.fund.service.api.domain.result.withdraw.VendorWithdrawDetailResult;
import com.frxs.fund.service.api.facade.widthdraw.StoreWithdrawFacade;
import com.frxs.fund.service.api.facade.widthdraw.VendorWithdrawFacade;
import lombok.Setter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author chenwang
 * @version $Id: FinancialAuditController.java,v 0.1 2018年02月26日 上午 11:43 $Exp
 */
@Setter
@Controller
@RequestMapping("financialAuditWeb")
public class FinancialAuditController {

    @Reference(check = false, version = "1.0.0")
    VendorWithdrawFacade vendorWithdrawFacade;

    @Reference(check = false, version = "1.0.0")
    StoreWithdrawFacade storeWithdrawFacade;

    /**
     *
     * @param storeWithdrawNo
     * @return
     * @throws Exception
     * 6B 门店提现省核  详情
     */
    @RequestMapping(value = "storeWithdrawalsDetails" ,method = {RequestMethod.GET, RequestMethod.POST})
    public String storeWithdrawalsDetails( ModelMap map,String storeWithdrawNo){

        StoreWithdrawDetailResult storeWithdrawDetailResult = null;
        try {
            storeWithdrawDetailResult = storeWithdrawFacade.findStoreWithdrawByPK(storeWithdrawNo);
            if (storeWithdrawDetailResult != null) {
                map.addAttribute("dto", storeWithdrawDetailResult.getFundStoreWithdrawDto());
                map.addAttribute("trackDto", storeWithdrawDetailResult.getListFundStoreWithdrawTrackDto());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "financialAudit/storeWithdrawalsDetail";
    }

    /**
     *
     * @param vendorWithdrawNo
     * @return
     * @throws Exception
     *  6C 供应商提现审核 提现详情
     */
    @RequestMapping(value = "vendorWithdrawalsDetails" ,method = {RequestMethod.GET, RequestMethod.POST})
    public String  vendorWithdrawalsDetails ( ModelMap map,String vendorWithdrawNo){
        VendorWithdrawDetailResult vendorWithdrawDetailResult = null;
        try {
            vendorWithdrawDetailResult = vendorWithdrawFacade.findVendorWithdrawByPK(vendorWithdrawNo);
            if (vendorWithdrawDetailResult != null) {
                map.addAttribute("dto", vendorWithdrawDetailResult.getVendorWithdrawDto());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "financialAudit/vendorWithdrawalsInfo";
    }

    //6B 门店提现省核 --> 省核按钮
    @RequestMapping(value = {"vendorAudit"}, method = RequestMethod.GET)
    public String storeAudit(ModelMap map) {
        return "financialAudit/vendorAudit";
    }

}
