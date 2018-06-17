package com.frxs.web.areaboss.controller.financialAudit;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.fund.service.api.domain.dto.DictDto;
import com.frxs.fund.service.api.domain.dto.refund.StoreRefundVendorDto;
import com.frxs.fund.service.api.domain.dto.withdraw.*;
import com.frxs.fund.service.api.domain.enums.StoreWithdrawEnum;
import com.frxs.fund.service.api.domain.enums.VendorWithdrawEnum;
import com.frxs.fund.service.api.domain.request.refund.StoreRefundVendorQryRequest;
import com.frxs.fund.service.api.domain.request.withdraw.StoreWithdrawBatchRequest;
import com.frxs.fund.service.api.domain.request.withdraw.StoreWithdrawQryRequest;
import com.frxs.fund.service.api.domain.request.withdraw.VendorWithdrawBatchRequest;
import com.frxs.fund.service.api.domain.request.withdraw.VendorWithdrawQryRequest;
import com.frxs.fund.service.api.domain.result.refund.StoreRefundVendorQryResult;
import com.frxs.fund.service.api.domain.result.withdraw.*;
import com.frxs.fund.service.api.facade.refund.StoreRefundFacade;
import com.frxs.fund.service.api.facade.refund.StoreRefundVendorFacade;
import com.frxs.fund.service.api.facade.widthdraw.StoreWithdrawFacade;
import com.frxs.fund.service.api.facade.widthdraw.VendorWithdrawFacade;
import com.frxs.web.areaboss.utils.Constants;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @author chenwang
 * @version $Id: FinancialAuditController.java,v 0.1 2018年02月26日 上午 11:43 $Exp
 */
@RestController
@RequestMapping("financialAudit")
public class FinancialAuditWebApiController {

    @Reference(timeout = 30000,check = false, version = "1.0.0")
    VendorWithdrawFacade vendorWithdrawFacade;

//    @Reference(timeout = 30000,check = false, version = "1.0.0",  url = "dubbo://127.0.0.1:28226")
    @Reference(timeout = 30000,check = false, version = "1.0.0")
    StoreWithdrawFacade storeWithdrawFacade;

    @Reference(timeout = 30000,check = false, version = "1.0.0")
    StoreRefundFacade storeRefundFacade;

    @Reference(timeout = 30000,check = false, version = "1.0.0")
    StoreRefundVendorFacade storeRefundVendorFacade;
    @Autowired
    HttpServletRequest request;
    /**
     * @param req
     * @return
     * @throws Exception
     * 6B 门店提现省核
     */
    @RequestMapping(value = "qryStoreWithdrawals" ,method = {RequestMethod.GET, RequestMethod.POST})
    public StoreWithdrawQryResult qryStoreWithdrawals(StoreWithdrawQryRequest req){
        if(req.getTmWithdrawEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmWithdrawEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmWithdrawEnd(c.getTime());
        }
        if(req.getTmFirstCheckEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmFirstCheckEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmFirstCheckEnd(c.getTime());
        }
        StoreWithdrawQryResult storeWithdrawQryResult = null;
        try {
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeWithdrawQryResult = storeWithdrawFacade.selectPageStoreWithdraw(req);
            if(!CollectionUtils.isEmpty(storeWithdrawQryResult.getFooter())){
                storeWithdrawQryResult.getFooter().get(0).setStoreName("合计");
                storeWithdrawQryResult.getFooter().get(0).setTaxAmt(null);
                storeWithdrawQryResult.getFooter().get(0).setTotalAmt(null);
                storeWithdrawQryResult.getFooter().get(0).setAuditingAmt(null);
                storeWithdrawQryResult.getFooter().get(0).setCanWithdrawAmt(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return storeWithdrawQryResult;
    }

    /**
     *
     * @param storeWithdrawNo
     * @return
     * @throws Exception
     * 6B 门店提现省核  详情-->跟踪
     */
    @RequestMapping(value = "getStoreWithdrawalsTrackList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public List<StoreWithdrawTrackDto> getStoreWithdrawalsTrackList(ModelMap map, String storeWithdrawNo){

        List<StoreWithdrawTrackDto> list = new ArrayList<>();
        StoreWithdrawTrackDto storeWithdrawTrackDto =null;
        StoreWithdrawDetailResult storeWithdrawDetailResult = null;
        try {
            storeWithdrawDetailResult = storeWithdrawFacade.findStoreWithdrawByPK(storeWithdrawNo);
            list = storeWithdrawDetailResult.getListFundStoreWithdrawTrackDto();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     *
     * @param
     * @return
     * @throws Exception
     * 6B 门店提现省核  审核功能
     */
    @RequestMapping(value = "storeWithdrawalsAudit" ,method = {RequestMethod.GET, RequestMethod.POST})
    public StoreWithdrawBatchResult storeWithdrawalsAudit(StoreWithdrawBatchDto storeWithdrawBatchDto){
        //区域Id
        Integer regionId = UserLoginInfoUtil.getRegionId(request).intValue();
        //返回结果类型
        StoreWithdrawBatchResult storeWithdrawBatchResult = null;
        StoreWithdrawBatchRequest storeWithdrawBatchRequest = new StoreWithdrawBatchRequest();

        storeWithdrawBatchDto.setUserId(UserLoginInfoUtil.getUserId(request));
        storeWithdrawBatchDto.setUserName(UserLoginInfoUtil.getUserName(request));
        storeWithdrawBatchDto.setTmCheck(new Date());
        storeWithdrawBatchRequest.setAreaId(regionId);
        storeWithdrawBatchRequest.setStoreWithdrawBatchDto(storeWithdrawBatchDto);
        try {
            storeWithdrawBatchResult = storeWithdrawFacade.batchFirstCheck(storeWithdrawBatchRequest);
            Map<String , Object> map = new HashMap<String , Object>();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return storeWithdrawBatchResult;
    }

    /**
     * 6B 门店提现省核 导出
     */
    @RequestMapping(value = "downloadStoreWithdrawalsExprot", method = {RequestMethod.POST, RequestMethod.GET})
    public List<StoreWithdrawDto> downloadStoreWithdrawalsExprot(StoreWithdrawQryRequest req) {
        //页面没有时分秒格式，结束时间加一天
        if(req.getTmWithdrawEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmWithdrawEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmWithdrawEnd(c.getTime());
        }
        if(req.getTmFirstCheckEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmFirstCheckEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmFirstCheckEnd(c.getTime());
        }

        StoreWithdrawQryResult storeWithdrawQryResult = null;
        List<StoreWithdrawDto> list = new ArrayList<>();
        try {
            //合计列
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setRows(Integer.MAX_VALUE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeWithdrawQryResult = storeWithdrawFacade.selectPageStoreWithdraw(req);
            if(!CollectionUtils.isEmpty(storeWithdrawQryResult.getFooter())){
                storeWithdrawQryResult.getFooter().get(0).setStoreName("合计");
                storeWithdrawQryResult.getFooter().get(0).setTaxAmt(null);
                storeWithdrawQryResult.getFooter().get(0).setTotalAmt(null);
                storeWithdrawQryResult.getFooter().get(0).setAuditingAmt(null);
                storeWithdrawQryResult.getFooter().get(0).setCanWithdrawAmt(null);
            }
            list = storeWithdrawQryResult.getRows();
            list.add(storeWithdrawQryResult.getFooter().get(0));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     *
     * @param req
     * @return
     * @throws Exception
     * 6C 供应商提现审核  查询
     */
    @RequestMapping(value = "getVendorWithdrawalsAuditList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public VendorWithdrawQryResult getVendorWithdrawalsAuditList(VendorWithdrawQryRequest req) {
        VendorWithdrawQryResult vendorWithdrawQryResult = null;
        try {
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            vendorWithdrawQryResult = vendorWithdrawFacade.selectListVendorWithdraw(req);
            if(!CollectionUtils.isEmpty(vendorWithdrawQryResult.getFooter())){
//            if(vendorWithdrawQryResult.getFooter().size() > 0){
                vendorWithdrawQryResult.getFooter().get(0).setVendorName("合计");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return vendorWithdrawQryResult;
    }

    /**
     *
     * @param vendorWithdrawNo
     * @return
     * @throws Exception
     * 6C 供应商提现审核  详情-->跟踪
     */
    @RequestMapping(value = "getVendorWithdrawalsTrackList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public List<VendorWithdrawTrackDto>  getVendorWithdrawalsTrackList(ModelMap map, String vendorWithdrawNo){
        List<VendorWithdrawTrackDto> list = new ArrayList<>();
        try {
            VendorWithdrawDetailResult vendorWithdrawDetailResult = vendorWithdrawFacade.findVendorWithdrawByPK(vendorWithdrawNo);
            list = vendorWithdrawDetailResult.getVendorWithdrawTrackDtoList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     *
     * @param req
     * vendorId and areaId
     * @return
     * @throws Exception
     * 6C 供应商提现审核  详情-->售后
     */
    @RequestMapping(value = "getStoreAfterSaleInfoList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public StoreRefundVendorQryResult getStoreAfterSaleInfoList(ModelMap map, StoreRefundVendorQryRequest req){
        StoreRefundVendorQryResult storeRefundVendorQryResult = null;
        try {
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundVendorQryResult = storeRefundFacade.selectStoreRefundVendor(req);
            if(!CollectionUtils.isEmpty(storeRefundVendorQryResult.getFooter())){
                storeRefundVendorQryResult.getFooter().get(0).setProductName("合计");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return storeRefundVendorQryResult;
    }

    /**
     *
     * @param vendorWithdrawBatchDto
     * @return
     * 6C 供应商提现审核  审核功能
     */
    @RequestMapping(value = "vendorWithdrawalsAudit" ,method = {RequestMethod.GET, RequestMethod.POST})
    public VendorWithdrawBatchResult vendorWithdrawalsAudit(VendorWithdrawBatchDto vendorWithdrawBatchDto){
        //区域Id
        Integer regionId = UserLoginInfoUtil.getRegionId(request).intValue();
        //返回结果类型
        VendorWithdrawBatchResult vendorWithdrawBatchResult = null;
        VendorWithdrawBatchRequest vendorWithdrawBatchRequest = new VendorWithdrawBatchRequest();

        vendorWithdrawBatchDto.setUserId(UserLoginInfoUtil.getUserId(request));
        vendorWithdrawBatchDto.setUserName(UserLoginInfoUtil.getUserName(request));
        vendorWithdrawBatchDto.setTmCheck(new Date());
        vendorWithdrawBatchDto.setAreaId(regionId);
//        vendorWithdrawBatchRequest.setAreaId(regionId);
        vendorWithdrawBatchRequest.setVendorWithdrawBatchDto(vendorWithdrawBatchDto);
        try {
            vendorWithdrawBatchResult = vendorWithdrawFacade.batchFirstCheck(vendorWithdrawBatchRequest);
            Map<String , Object> map = new HashMap<String , Object>();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return vendorWithdrawBatchResult;
    }


    /**
     * 6C 供应商提现审核 导出
     */
    @RequestMapping(value = "downloadVendorWithdrawalsAuditList", method = {RequestMethod.POST, RequestMethod.GET})
    public List<VendorWithdrawDto> downloadVendorWithdrawalsAuditList(VendorWithdrawQryRequest req) {
        VendorWithdrawQryResult vendorWithdrawQryResult = null;
        List<VendorWithdrawDto> list = new ArrayList<>();
        try {
            //合计列
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setRows(Integer.MAX_VALUE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            vendorWithdrawQryResult = vendorWithdrawFacade.selectListVendorWithdraw(req);
            if(!CollectionUtils.isEmpty(vendorWithdrawQryResult.getFooter())){
                vendorWithdrawQryResult.getFooter().get(0).setVendorName("合计");
            }
            list = vendorWithdrawQryResult.getRows();
            list.add(vendorWithdrawQryResult.getFooter().get(0));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 6B 门店提现省核
     * 获取状态名称(枚举)
     * @return
     */
    @RequestMapping(value = "storeWithdrawalsStatus" ,method = {RequestMethod.GET, RequestMethod.POST})
    public List<DictDto> storeWithdrawalsStatus(){

        List<DictDto> list = new ArrayList<>();
        try {
            list = StoreWithdrawEnum.getListStatus();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 6C 供应商提现审核
     * 获取状态名称(枚举)
     * @return
     */
    @RequestMapping(value = "vendorWithdrawalsStatus" ,method = {RequestMethod.GET, RequestMethod.POST})
    public List<DictDto> vendorWithdrawalsStatus(){

        List<DictDto> list = new ArrayList<>();
        try {
            list = VendorWithdrawEnum.getListStatus();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
    /**
     *
     * @param req
     * @return
     * @throws Exception
     *  6E 供应商结算统计查询
     */
    @RequestMapping(value = "getVendorBalanceList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public StoreRefundVendorQryResult getVendorBalanceList(StoreRefundVendorQryRequest req){
        //页面没有时分秒格式，结束时间加一天
        if(req.getTmActivityEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmActivityEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmActivityEnd(c.getTime());
        }
        StoreRefundVendorQryResult storeRefundVendorQryResult = null;
        try {
            //必传
            req.setNeedPage("1");
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundVendorQryResult = storeRefundVendorFacade.selectSaleRefundPage(req);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return storeRefundVendorQryResult;
    }

    /**
     *
     * @param req
     * @return
     * @throws Exception
     *  6E 供应商结算统计查询 导出
     */
    @RequestMapping(value = "downloadVendorBalanceList", method = {RequestMethod.POST, RequestMethod.GET})
    public List<StoreRefundVendorDto> downloadVendorBalanceList(StoreRefundVendorQryRequest req) {
        //页面没有时分秒格式，结束时间加一天
        if(req.getTmActivityEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmActivityEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmActivityEnd(c.getTime());
        }
        StoreRefundVendorQryResult storeRefundVendorQryResult = null;
        List<StoreRefundVendorDto> list = new ArrayList<>();
        try {
            //合计列
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setPage(Constants.SHOWFOOTER_ONE);
            //必传
            req.setNeedPage("1");
            req.setRows(1000000000);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundVendorQryResult = storeRefundVendorFacade.exportVendorSaleQtyList(req);
            if(!CollectionUtils.isEmpty(storeRefundVendorQryResult.getFooter())){
                storeRefundVendorQryResult.getFooter().get(0).setProductName("合计");
            }
            list = storeRefundVendorQryResult.getRows();
            list.add(storeRefundVendorQryResult.getFooter().get(0));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     *
     * @param req
     * @return
     * @throws Exception
     *  6K 供应商商品问题扣款
     */
    @RequestMapping(value = "getVendorCommodityProblemList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public StoreRefundVendorQryResult getVendorCommodityProblemList(StoreRefundVendorQryRequest req){
        //页面没有时分秒格式，结束时间加一天
        if(req.getTmActivityEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmActivityEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmActivityEnd(c.getTime());
        }
        StoreRefundVendorQryResult storeRefundVendorQryResult = null;
        try {
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundVendorQryResult = storeRefundVendorFacade.selectPage(req);
            if(!CollectionUtils.isEmpty(storeRefundVendorQryResult.getFooter())){
                storeRefundVendorQryResult.getFooter().get(0).setSingleVendorAmt(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return storeRefundVendorQryResult;
    }

    /**
     *
     * @param req
     * @return
     * @throws Exception
     *  6K 供应商商品问题扣款 导出
     */
    @RequestMapping(value = "downloadCommodityProblemList", method = {RequestMethod.POST, RequestMethod.GET})
    public List<StoreRefundVendorDto> downloadCommodityProblemList(StoreRefundVendorQryRequest req) {
        //页面没有时分秒格式，结束时间加一天
        if(req.getTmActivityEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(req.getTmActivityEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            req.setTmActivityEnd(c.getTime());
        }
        StoreRefundVendorQryResult storeRefundVendorQryResult = null;
        List<StoreRefundVendorDto> list = new ArrayList<>();
        try {
            //合计列
            req.setFooterFlag(Constants.SHOWFOOTER_ONE);
            req.setRows(1000000000);
            req.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundVendorQryResult = storeRefundVendorFacade.selectPage(req);
            if(!CollectionUtils.isEmpty(storeRefundVendorQryResult.getFooter())){
                storeRefundVendorQryResult.getFooter().get(0).setProductName("合计");
                storeRefundVendorQryResult.getFooter().get(0).setSingleVendorAmt(null);
            }
            list = storeRefundVendorQryResult.getRows();
            list.add(storeRefundVendorQryResult.getFooter().get(0));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
