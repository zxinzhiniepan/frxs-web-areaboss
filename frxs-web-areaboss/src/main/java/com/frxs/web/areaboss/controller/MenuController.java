/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.merchant.service.api.facade.StoreFacade;
import com.frxs.sso.sso.SessionUser;
import com.frxs.sso.sso.SessionUtils;
import com.frxs.trade.service.api.OrderQryAreaFacade;
import com.frxs.web.areaboss.dto.LoginInfoDto;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author liudiwei
 * @version $Id: MenuController.java,v 0.1 2017年12月25日 18:39 $Exp
 */
@Controller
public class MenuController {
    @Reference(timeout = 30000, check = false,version = "1.0.0")
    private OrderQryAreaFacade orderQryAreaFacade;

    @Reference(check = false,version = "1.0.0")
    private StoreFacade storeFacade;

    @RequestMapping(value = {"","/home/index"}, method = RequestMethod.GET)
    public String homeIndex(HttpServletRequest request,ModelMap map) {
        LoginInfoDto loginInfoDto = new LoginInfoDto();
        SessionUser sessionUser = SessionUtils.getSessionUser(request);
        if(sessionUser!=null&&sessionUser.getAccount()!=null&&!"".equals(sessionUser.getAccount())){
            loginInfoDto.setUserName(sessionUser.getAccount());
        }
        if(sessionUser!=null&&sessionUser.getRegionName()!=null&&!"".equals(sessionUser.getRegionName())){
            loginInfoDto.setLoginArea(sessionUser.getRegionName());
            loginInfoDto.setTitle("兴盛优选"+sessionUser.getRegionName()+"管理中心后台");
        }
        map.addAttribute("loginInfoDto",loginInfoDto);
        return "home/index";
    }

    @RequestMapping(value = {"/home/main"}, method = RequestMethod.GET)
    public String homeMain(HttpServletRequest request,ModelMap map) {
        LoginInfoDto loginInfoDto = new LoginInfoDto();
        SessionUser sessionUser = SessionUtils.getSessionUser(request);
        if(sessionUser!=null&&sessionUser.getAccount()!=null&&!"".equals(sessionUser.getAccount())){
            loginInfoDto.setUserName(sessionUser.getAccount());
        }
        if(sessionUser!=null&&sessionUser.getRegionName()!=null&&!"".equals(sessionUser.getRegionName())){
            loginInfoDto.setLoginArea(sessionUser.getRegionName());
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        loginInfoDto.setLoginTime( sdf.format(new Date()));
        map.addAttribute("loginInfoDto",loginInfoDto);
        return "home/main";
    }

    @RequestMapping(value = {"/products/productList"}, method = RequestMethod.GET)
    public String productList(ModelMap map) {
        return "products/productList";
    }

    @RequestMapping(value = {"/products/selectVendor"}, method = RequestMethod.GET)
    public String selectVendor(ModelMap map) {
        return "products/selectVendor";
    }

    @RequestMapping(value = {"/fBill/fBillList"}, method = RequestMethod.GET)
    public String fBillList(ModelMap map) {
        return "fBill/fBillList";
    }

    @RequestMapping(value = {"/daySettlement/daySettlementList"}, method = RequestMethod.GET)
    public String daySettlementList(ModelMap map) {
        return "daySettlement/daySettlementList";
    }

    /**2C:商品显示顺序调整*/
    @RequestMapping(value = {"/marketing/productSort"}, method = RequestMethod.GET)
    public String productSort(ModelMap map) {
        return "marketing/productSort";
    }

    /**4A:图文直播管理**/
    @RequestMapping(value = {"/marketing/teletext"}, method = RequestMethod.GET)
    public String teletext(ModelMap map) {
        return "marketing/teletext";
    }

    /**4C:供应商商品管理**/
    @RequestMapping(value = {"/vendor/vendorProductManagement"}, method = RequestMethod.GET)
    public String vendorProductManagement(ModelMap map) {
        return "vendor/vendorProductManagement";
    }

    /**门店售后审核选择供应商按钮跳转*/
    @RequestMapping(value = {"/presaleActivity/vendorActivityProductList"}, method = RequestMethod.GET)
    public String selectvendorActivityProductList(ModelMap map) {
        return "presaleActivity/vendorActivityProductList";
    }

    /**门店售后审核选择商品按钮跳转*/
    @RequestMapping(value = {"/vendor/selectVendor"}, method = RequestMethod.GET)
    public String selectVendors(ModelMap map) {
        return "vendor/selectVendor";
    }

    /**仓库管理：送货线路商品汇总表*/
    @RequestMapping(value = {"/operationArea/aspnetUserLine"}, method = RequestMethod.GET)
    public String selectaspnetUserList(ModelMap map) {
        return "operationArea/aspnetUsersLine";
    }

    /**仓库管理：门店消费者订单查询打印*/
    @RequestMapping(value = {"/operationArea/printAspnetUsersSaleas"}, method = RequestMethod.GET)
    public String printAspnetUsersSaleas(ModelMap map) {
        return "operationArea/printAspnetUsersSaleas";
    }

    /**报表管理：门店累计配送报表*/
    @RequestMapping(value = {"/report/storeSaleas"}, method = RequestMethod.GET)
    public String selectStoreSaleas(ModelMap map) {
        return "report/storeSaleas";
    }

    /**报表管理：门店商品配送统计报表*/
    @RequestMapping(value = {"/report/storeDistribution"}, method = RequestMethod.GET)
    public String selectStoreDistribution(ModelMap map) {
        return "report/storeDistribution";
    }

    /**报表管理：商品订购收益报表*/
    @RequestMapping(value = {"/report/commodityOrderlncome"}, method = RequestMethod.GET)
    public String selectCommodityOrderlncome(ModelMap map) {
        return "report/commodityOrderlncome";
    }



    @RequestMapping(value="/report/supplierBalanceAmountList", method = RequestMethod.GET)
    public String supplierBalanceAmountList(ModelMap map){
        return "report/supplierBalanceAmountList";
    }

    @RequestMapping(value="/report/vendorBalanceAmountList", method = RequestMethod.GET)
    public String vendorBalanceAmountList(ModelMap map){
        return "report/vendorBalanceAmountList";
    }

    @RequestMapping(value="/report/vendorPayInfo", method = RequestMethod.GET)
    public String vendorPayInfo(ModelMap map) {
        return "report/vendorPayInfo";
    }

    //9A 短信管理
    @RequestMapping(value = {"/systemManagement/smsDataList"}, method = RequestMethod.GET)
    public String smsDataList(ModelMap map) {
        return "systemManagement/smsDataList";
    }

    //3A 订单管理
    @RequestMapping(value = {"/orders/orders"}, method = RequestMethod.GET)
    public String orders(ModelMap map) {
        return "ordersManagement/orders";
    }

    //3A 订单管理 订单详情    返回页面和订单详情可以有多列(例如订单管理第四条数据)
    @RequestMapping(value = "/orders/orderItems", method = {RequestMethod.GET})
    public String orderItems(ModelMap map){
        return "ordersManagement/orderItems";
    }

    //6B 门店提现省核
    @RequestMapping(value = {"/financialAudit/storeWithdrawals"}, method = RequestMethod.GET)
    public String storeWithdrawals(ModelMap map) {
        return "financialAudit/storeWithdrawals";
    }

    //6B 门店提现省核 --> 省核按钮
    @RequestMapping(value = {"/financialAudit/storeAudit"}, method = RequestMethod.GET)
    public String storeAudit(ModelMap map) {
        return "financialAudit/storeAudit";
    }
    //6C 供应商提现省核
    @RequestMapping(value = {"/financialAudit/vendorWithdrawals"}, method = RequestMethod.GET)
    public String vendorWithdrawals(ModelMap map) {
        return "financialAudit/vendorWithdrawals";
    }

    //6D 门店售后审核
    @RequestMapping(value = {"/financialAudit/storeProductReturn"}, method = RequestMethod.GET)
    public String storeProductReturn(ModelMap map) {
        return "storeProfile/storeProductReturn";
    }

    //6E 供应商结算统计查询
    @RequestMapping(value = {"/financialAudit/vendorBalance"}, method = RequestMethod.GET)
    public String vendorBalance(ModelMap map) {
        return "financialAudit/vendorBalance";
    }

    //6F 供应商违约罚款
    @RequestMapping(value = {"/financialAudit/vendorFine"}, method = RequestMethod.GET)
    public String vendorFine(ModelMap map) {
        return "vendorFine/fineList";
    }

    //6K 供应商商品问题扣款
    @RequestMapping(value = {"/report/vendorCommodityProblemList"}, method = RequestMethod.GET)
    public String vendorCommodityProblemList(ModelMap map) {
        return "report/vendorCommodityProblemList";
    }

    //18D 商品配送报表
    @RequestMapping(value = {"/report/merchandiseSalesReport"}, method = RequestMethod.GET)
    public String merchandiseSalesReport(ModelMap map) {
        return "report/merchandiseSalesReport";
    }
    //18D 商品配送报表  商品详情
    @RequestMapping(value = {"/report/productsOrderInfo"}, method = RequestMethod.GET)
    public String productsOrderInfo(ModelMap map) {
        return "report/productsOrderInfo";
    }

    //18A 门店累计配送报表  门店销量详情
    @RequestMapping(value = {"/report/storeSaleasOrderDetails"}, method = RequestMethod.GET)
    public String storeSaleasOrderDetails(ModelMap map) {
        return "report/storeSaleasOrderDetails";
    }

    //7B 门店商品配送汇总查询
    @RequestMapping(value = "/operationArea/storeDistribution", method = {RequestMethod.GET})
    public String storeDistribution() {
        return "operationArea/aspnetUsersDistribution";
    }

    //7C 门店消费者订单查询
    @RequestMapping(value = "/operationArea/storeSaleas", method = {RequestMethod.GET})
    public String storeSaleas() {
        return "operationArea/aspnetUsersSaleas";
    }

    //  查看指定提货日期有多条配送线路的门店列表
    @RequestMapping(value = "/operationArea/storeLine", method = {RequestMethod.GET})
    public String storeLine() {
        return "operationArea/storeLine";
    }


    //7D 商品订购查询
    @RequestMapping(value = "/operationArea/storeCommodityOrder", method = {RequestMethod.GET})
    public String storeCommodityOrder() {
        return "operationArea/aspnetUsersCommodityOrder";
    }

    //7E 送货线路商品汇总表
    @RequestMapping(value = "/operationArea/lineProd", method = {RequestMethod.GET})
    public String store() {
        return "operationArea/aspnetUsersLine";
    }

    //7F供应商物流对账表
    @RequestMapping(value="/operationArea/supplierNewReconciliation", method = RequestMethod.GET)
    public String supplierNewReconciliation(ModelMap map){
        return "operationArea/supplierNewReconciliation";
    }

    @RequestMapping(value = "/products/selectProductList", method = {RequestMethod.GET})
    public String selectProductList() {
        return "products/selectProductList";
    }

    @RequestMapping(value = "/report/supplierReconciliation", method = {RequestMethod.GET})
    public String supplierReconciliation() {
        return "report/supplierReconciliation";
    }

}
