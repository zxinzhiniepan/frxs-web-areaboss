package com.frxs.web.areaboss.controller.daySettle;


import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.fund.service.api.domain.dto.DaySettleDto;
import com.frxs.fund.service.api.domain.dto.store.StoreSettleDto;
import com.frxs.fund.service.api.domain.dto.vendor.VendorSettleDto;
import com.frxs.fund.service.api.domain.request.store.StoreSettleRequest;
import com.frxs.fund.service.api.domain.request.vendor.DaySettleRequest;
import com.frxs.fund.service.api.domain.request.vendor.VendorSettleRequest;
import com.frxs.fund.service.api.domain.result.clearsettle.DaySettleResult;
import com.frxs.fund.service.api.domain.result.store.StoreSettleResult;
import com.frxs.fund.service.api.domain.result.vendor.VendorSettleResult;
import com.frxs.fund.service.api.facade.vendor.DaySettleFacade;
import com.frxs.sso.sso.SessionUser;
import com.frxs.sso.sso.SessionUtils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author wang.zhen
 * @version $Id: TradeController.java,v 0.1 2018年02月07日 18:41 $Exp
 */

@Controller
public class DaySettleController {
    @Reference(check = false,version = "1.0.0",timeout = 120000 )
    private DaySettleFacade daySettleFacade;

    @RequestMapping(value="/daySettlement/getDaySettlementList")
    @ResponseBody
    public Map getDaySettlementList(DaySettleRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        try{
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            DaySettleResult<Page<DaySettleDto>> result= daySettleFacade.queryDaySettlePage(request);
            Page<DaySettleDto> pageInfo=result.getData();
            resultMap.put("rows",pageInfo.getRecords());
            resultMap.put("total",pageInfo.getTotal());
            List list=new ArrayList();
            DaySettleResult<DaySettleDto> daySettleResult=daySettleFacade.sumDaySettle(request);
            if(daySettleResult!=null && daySettleResult.getData()!=null){
                DaySettleDto daySettleDto = daySettleResult.getData();
                daySettleDto.setSettleMode("合计");
                list.add(daySettleDto);
            }
            resultMap.put("footer",list);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }
    /**
     * 门店结算详情
     * @param map
     * @return
     */
    @RequestMapping(value="/daySettlement/storeDaySettlementList")
    public String storeDaySettlementList(ModelMap map,StoreSettleRequest request){
        map.addAttribute("settleDate",request.getSettleDate());
        map.addAttribute("areaId",request.getAreaId());
        return "daySettlement/storeDaySettlementList";
    }

    @RequestMapping(value="/daySettlement/getStoreDaySettlementList")
    @ResponseBody
    public Map getStoreDaySettlementList(StoreSettleRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        try{
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            StoreSettleResult<Page<StoreSettleDto>> result= daySettleFacade.queryStorePage(request);
            Page<StoreSettleDto> pageInfo=result.getData();
            resultMap.put("rows",pageInfo.getRecords());
            resultMap.put("total",pageInfo.getTotal());
            List list=new ArrayList();
            StoreSettleResult<StoreSettleDto> daySettleResult=daySettleFacade.sumStoreSettle(request);
            if(daySettleResult!=null && daySettleResult.getData()!=null){
                list.add(daySettleResult.getData());
            }
            resultMap.put("footer",list);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }


    /**
     * 供应商结算详情
     * @param map
     * @return
    **/
    @RequestMapping(value="/daySettlement/vendorDaySettlementList")
    public String vendorDaySettlementList(ModelMap map,VendorSettleRequest request){
        map.addAttribute("settleDate",request.getSettleDate());
        map.addAttribute("areaId",request.getAreaId());
        return "daySettlement/vendorDaySettlementList";
    }

    @RequestMapping(value="/daySettlement/getVendorDaySettlementList")
    @ResponseBody
    public Map getVendorDaySettlementList(VendorSettleRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        try{
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            VendorSettleResult<Page<VendorSettleDto>> result= daySettleFacade.queryVendorPage(request);
            Page<VendorSettleDto> pageInfo=result.getData();
            resultMap.put("rows",pageInfo.getRecords());
            resultMap.put("total",pageInfo.getTotal());
            List list=new ArrayList();
            VendorSettleResult<VendorSettleDto> daySettleResult=daySettleFacade.sumVendorSettle(request);
            if(daySettleResult!=null && daySettleResult.getData()!=null){
                list.add(daySettleResult.getData());
            }
            resultMap.put("footer",list);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 导出日结算
     * @param request
     * @return
    **/
    @RequestMapping(value="/daySettlement/excelDaySettlementList")
    @ResponseBody
    public List<DaySettleDto> excelDaySettlementList(DaySettleRequest request,HttpServletRequest request2){
        List<DaySettleDto> list=null;
        try{
            request.setPage(1);
            request.setRows(Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            DaySettleResult<Page<DaySettleDto>> result= daySettleFacade.queryDaySettlePage(request);
            Page<DaySettleDto> pageInfo=result.getData();
            DaySettleDto result1=daySettleFacade.sumDaySettle(request).getData();
            list=pageInfo.getRecords();
            if(result1!=null){
                result1.setAccountDate("合计");
                list.add(result1);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 导出供应商日结算
     * @param request
     * @return
    */
    @RequestMapping(value="/daySettlement/excelVendorDaySettlementList")
    @ResponseBody
    public List<VendorSettleDto> excelVendorDaySettlementList(VendorSettleRequest request,HttpServletRequest request2){
        List<VendorSettleDto> list=null;
        try{
            request.setPage(1);
            request.setRows(Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            VendorSettleResult<Page<VendorSettleDto>> result= daySettleFacade.queryVendorPage(request);
            Page<VendorSettleDto> pageInfo=result.getData();
            list=pageInfo.getRecords();
            VendorSettleResult<VendorSettleDto> result1=daySettleFacade.sumVendorSettle(request);
            if(result1!=null && result1.getData()!=null){
                result1.getData().setVendorName("合计");
                list.add(result1.getData());
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 导出门店日结算
     * @param request
     * @return
    **/
    @RequestMapping(value="/daySettlement/excelStoreDaySettlementList")
    @ResponseBody
    public List<StoreSettleDto> excelStoreDaySettlementList(StoreSettleRequest request,HttpServletRequest request2){
        List<StoreSettleDto> list=null;
        try{
            request.setPage(1);
            request.setRows(Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            StoreSettleResult<Page<StoreSettleDto>> result= daySettleFacade.queryStorePage(request);
            Page<StoreSettleDto> pageInfo=result.getData();
            list=pageInfo.getRecords();
            StoreSettleResult<StoreSettleDto> result1=daySettleFacade.sumStoreSettle(request);
            if(result1!=null && result1.getData()!=null){
                result1.getData().setStoreName("合计");
                list.add(result1.getData());
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }



}
