
package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.util.common.DateUtil;
import com.frxs.framework.util.common.StringUtil;
import com.frxs.framework.util.common.log4j.LogUtil;
import com.frxs.fund.service.api.domain.request.export.ExcelExportRequest;
import com.frxs.fund.service.api.domain.result.export.ExcelExportResult;
import com.frxs.fund.service.api.facade.export.ExcelExportFacade;
import com.frxs.merchant.service.api.domain.request.StoreRequest;
import com.frxs.merchant.service.api.dto.StoreDto;
import com.frxs.merchant.service.api.facade.StoreFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.sso.utils.StringUtils;
import com.frxs.trade.service.api.ReportAreaFacade;
import com.frxs.trade.service.api.dto.StoreMobQryDto;
import com.frxs.trade.service.api.dto.report.CommodityReportAreaDto;
import com.frxs.trade.service.api.dto.report.CommodityReportGridAreaDto;
import com.frxs.trade.service.api.dto.report.DistributionReportAreaDto;
import com.frxs.trade.service.api.dto.report.DistributionReportGridAreaDto;
import com.frxs.trade.service.api.dto.report.ProductSaleCollectDto;
import com.frxs.trade.service.api.dto.report.StoreSaleasAreaDto;
import com.frxs.trade.service.api.dto.report.StoreSaleasGridAreaDto;
import com.frxs.trade.service.api.dto.request.TradeExcelExportRequest;
import com.frxs.trade.service.api.dto.result.TradeAreaPageResult;
import com.frxs.trade.service.api.dto.result.TradeExcelExportResult;
import com.frxs.trade.service.api.dto.stat.StoreUserDto;
import com.frxs.user.service.api.dto.StoreUserCountDto;
import com.frxs.user.service.api.dto.UserApiDto;
import com.frxs.user.service.api.facade.UserFacade;
import com.frxs.user.service.api.facade.UserStoreFacade;
import com.frxs.user.service.api.result.UserResult;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import com.google.common.collect.Lists;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


/**
 * @author chenwang
 * @version $Id: ReportController.java,v 0.1 2018年02月05日 下午 15:42 $Exp
 */


@RestController
@RequestMapping("report")
public class ReportController {

//    @Reference(timeout = 120000, check = false,url="dubbo://127.0.0.1:8206",version = "1.0.0")
    @Reference(timeout = 120000, check = false,version = "1.0.0")
    private ReportAreaFacade reportAreaFacade;

    //    , url = "dubbo://192.168.6.222:8216"
    @Reference(timeout = 60000,check = false,version = "1.0.0")
    private StoreFacade storeFacade;

    @Reference(timeout = 60000,check = false,version = "1.0.0")
    private UserStoreFacade userStoreFacade;

    @Reference(timeout = 60000,check = false,version = "1.0.0")
    private UserFacade userFacade;

//    @Reference(timeout = 120000, check = false,url="dubbo://127.0.0.1:8206",version = "1.0.0")
    @Reference(check = false, version = "1.0.0",timeout = 120000)
    ExcelExportFacade excelExportFacade;

    @Autowired
    HttpServletRequest request;

    //18A 门店累计配送报表
    @RequestMapping(value = "storeSaleasStatistics", method = {RequestMethod.GET, RequestMethod.POST})
    public TradeAreaPageResult<StoreSaleasGridAreaDto> storeSaleasStatistics(HttpServletRequest request, StoreSaleasAreaDto dto) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setEndPayDate(TimeToolsUtil.setEndDate(dto.getEndPayDate(),"yyyy-MM-dd"));
        dto.setEndCreateTime(TimeToolsUtil.setEndDate(dto.getEndCreateTime(),"yyyy-MM-dd"));

        transWareHouser(dto);
        TradeAreaPageResult<StoreSaleasGridAreaDto> tradeAreaPageResult = new TradeAreaPageResult<>();
        tradeAreaPageResult.setTotal(0);
        tradeAreaPageResult.setRows(new ArrayList<>());
//        门店编号， 门店名称， 门店创建日期， 门店开发人员 ，门店状态， 获取门店Idlist
        StoreRequest storeRequest = new StoreRequest();
        if (StringUtil.isNotBlank(dto.getStoreNo()) || StringUtil.isNotBlank(dto.getStoreName()) ||StringUtil.isNotBlank(dto.getStoreDeveloper()) || StringUtil.isNotBlank(dto.getShopStatus()) ||StringUtil.isNotBlank(dto.getBeginCreateTime())||StringUtil.isNotBlank(dto.getEndCreateTime())) {
            storeRequest.setStoreCode(dto.getStoreNo());
            storeRequest.setStoreName(dto.getStoreName());
            storeRequest.setStoreDeveloper(dto.getStoreDeveloper());
            if(StringUtil.isNotBlank(dto.getShopStatus())) {
                if("1".equals(dto.getShopStatus())){
                    storeRequest.setStoreStatus(StatusEnum.NORMAL.getValueDefined());
                }else if("2".equals(dto.getShopStatus())){
                    storeRequest.setStoreStatus(StatusEnum.FROZEN.getValueDefined());
                }else{
                    storeRequest.setStoreStatus(StatusEnum.DELETE.getValueDefined());
                }
            }
            storeRequest.setTmOnLineStart(dto.getBeginCreateTime());
            storeRequest.setTmOnLineEnd(dto.getEndCreateTime());
            MerchantResult<List<StoreDto>> merchantResult = storeFacade.getStoreList(storeRequest);
            List<Long> storeIds = new ArrayList<>();
            if (merchantResult.isSuccess()&&CollectionUtils.isNotEmpty(merchantResult.getData())) {
                List<StoreDto> storeDtos = merchantResult.getData();
                for (StoreDto storeDto1 : storeDtos) {
                    storeIds.add(storeDto1.getStoreId());
                }
            }else{
                ErrorContext errorContext = merchantResult.getErrorContext();
                if(null!=errorContext) {
                    tradeAreaPageResult.setRspCode(errorContext.fetchCurrentErrorCode());
                    tradeAreaPageResult.setRspInfo(errorContext.fetchCurrentError().getErrorMsg());
                }else{
                    tradeAreaPageResult.setRspCode(ResponseCode.FAILED);
                    tradeAreaPageResult.setRspInfo("storeSaleasStatistics:: Get storeIds failed.");
                }
            }
//            未找到对应门店
            if(CollectionUtils.isEmpty(storeIds)){
                tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
                tradeAreaPageResult.setRspInfo("未找到对应的门店。");
                return tradeAreaPageResult;
            }
            dto.setStoreIds(storeIds);
        }

        tradeAreaPageResult = reportAreaFacade.storeSaleasStatistics(dto);

        if(tradeAreaPageResult.isSuccess()&&CollectionUtils.isNotEmpty(tradeAreaPageResult.getRows())) {
            //         获取门店创建日期， 门店开发人员
            List<StoreSaleasGridAreaDto> storeSaleasGridAreaDtos = tradeAreaPageResult.getRows();
            List<String> storeCodes = new ArrayList<>();
            List<Long> storeIds = new ArrayList<>();

//            for (StoreSaleasGridAreaDto storeSaleasGridAreaDto : storeSaleasGridAreaDtos) {
//                storeCodes.add(storeSaleasGridAreaDto.getStoreNo());
//                storeIds.add(storeSaleasGridAreaDto.getStoreId());
//            }
//            组装入参数据
            storeSaleasGridAreaDtos.forEach(item->{
                storeCodes.add(item.getStoreNo());
                storeIds.add(item.getStoreId());
            });

            Map<Long , StoreDto> storeMap = new HashMap<>();
            MerchantResult<List<StoreDto>> merchantResult  = storeFacade.getStoreListByCodes(storeCodes);
            if(merchantResult.isSuccess()&&CollectionUtils.isNotEmpty(merchantResult.getData())){
                List<StoreDto> storeDtos  = merchantResult.getData();
//                 key storeNo , value storeDto
                for (StoreDto storeDto : storeDtos) {
                    storeMap.put(storeDto.getStoreId(),storeDto);
                }

            }

            //        获取新增会员 和 累计会员
//             storeUserCntMap  key storeId  value StoreUserCountDto
            Map<Long , StoreUserCountDto> storeUserCntMap = new HashMap<>();
            UserResult userResult  = null;
            //        List<Long> var1, Date var2, Date var3
            if (StringUtil.isNotBlank(dto.getBeginCreateTime()) && StringUtil.isNotBlank(dto.getEndCreateTime())){
                Date beginCreatTime = TimeToolsUtil.parseDateStr(dto.getBeginCreateTime(), DateUtil.DATA_FORMAT_YYYY_MM_DD);
                Date endCreatTime = TimeToolsUtil.parseDateStr(dto.getEndCreateTime(), DateUtil.DATA_FORMAT_YYYY_MM_DD);
                if(null!=beginCreatTime&&null!=endCreatTime) {
                    userResult  = userStoreFacade.findUserCount(storeIds, beginCreatTime, endCreatTime);
                }else{
                    userResult  =   userStoreFacade.findUserCount(storeIds, null, null);
                }
            }else{
                userResult  =  userStoreFacade.findUserCount(storeIds, null, null);
            }
            if(userResult!=null&&userResult.isSuccess()) {
                List<StoreUserCountDto> storeUserCountDtos = (List<StoreUserCountDto>) userResult.getData();
                if(CollectionUtils.isNotEmpty(storeUserCountDtos)) {
                    storeUserCountDtos.forEach(item -> storeUserCntMap.put(item.getStoreId(), item));
                }
            }

//            塞入数据
            storeSaleasGridAreaDtos.forEach(item->{
                StoreDto storeDto = storeMap.get(item.getStoreId());
                if(null!=storeDto) {
                    item.setCreateTime(storeDto.getTmOnLine());
                    item.setStoreDeveloper(storeDto.getStoreDeveloper());
                }

                StoreUserCountDto storeUserCountDto  = storeUserCntMap.get(item.getStoreId());
                if(null!=storeUserCountDto){
                    item.setNewsMembers(storeUserCountDto.getNewlyUserCount());
                    item.setAllMembers(storeUserCountDto.getUserCount());
                }
            });

//            for (StoreSaleasGridAreaDto storeSaleasGridAreaDto : storeSaleasGridAreaDtos) {
//                StoreDto storeDto = storeMap.get(storeSaleasGridAreaDto.getStoreNo());
//                if(null!=storeDto) {
//                    String createTime = storeDto.getTmOnLine();
//                    storeSaleasGridAreaDto.setCreateTime(createTime);
//                    storeSaleasGridAreaDto.setStoreDeveloper(storeDto.getStoreDeveloper());
//                }
//            }

        }else{
            tradeAreaPageResult.setRspCode(tradeAreaPageResult.getRspCode());
            ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
            if(errorContext1!=null&&StringUtil.isNotBlank(errorContext1.toString())) {
                tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
            }
            return tradeAreaPageResult;
        }
        tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
        return tradeAreaPageResult;
    }

    //18A 门店累计配送报表导出
    @RequestMapping(value = "exportStoreSaleasStatistics", method = {RequestMethod.GET, RequestMethod.POST})
    public List<StoreSaleasGridAreaDto> exportStoreSaleasStatistics(HttpServletRequest request, StoreSaleasAreaDto dto) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
        List<StoreSaleasGridAreaDto> storeSaleasGridAreaDtos = new ArrayList();
        TradeAreaPageResult<StoreSaleasGridAreaDto> tradeAreaPageResult = storeSaleasStatistics(request,dto);
        if(tradeAreaPageResult.isSuccess()){
            storeSaleasGridAreaDtos = tradeAreaPageResult.getRows();
            storeSaleasGridAreaDtos.add(tradeAreaPageResult.getFooter().get(1));
        }
        return storeSaleasGridAreaDtos;
    }

    //18A 门店累计配送报表导出(导出共享磁盘)
    @RequestMapping(value = "/storeSaleasExcel",method = {RequestMethod.GET,RequestMethod.POST})
    public WebResult storeSaleasExcel(StoreSaleasAreaDto dto,HttpServletResponse response)throws IOException {
        WebResult webResult = new WebResult();
        String fileName = "区域门店累计配送_"+ TimeToolsUtil.getUserDate();
        String title = "兴盛电商-【兴盛优选】门店累计配送报表";
        String sheetName= "门店累计配送";
        String[] arrName = {"仓库", "门店编号", "门店名称", "联系电话", "地址", "门店上线日期", "线路",
            "门店开发人员", "合计订单量", "合计订货量", "配送金额", "合计提成", "新增会员", "累计会员"};

        String[] arrField = {"wareHouseName", "storeNo", "storeName", "storeTel", "storeAddress",
            "createTime", "lineName", "storeDeveloper", "totalOrderNumber", "qty", "sumSalePrice",
            "totalCommission", "newsMembers", "allMembers"};

        TradeExcelExportResult excelExportResult = new TradeExcelExportResult();
        TradeExcelExportRequest tradeExcelExportRequest = new TradeExcelExportRequest();

        try {
            dto.setRows(Integer.MAX_VALUE);
            dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            tradeExcelExportRequest.setObj(dto);
            tradeExcelExportRequest.setArrName(arrName);
            tradeExcelExportRequest.setArrField(arrField);
            tradeExcelExportRequest.setSheetName(sheetName);
            tradeExcelExportRequest.setFileName(fileName);
            tradeExcelExportRequest.setTitle(title);
            excelExportResult = reportAreaFacade.exportStoreSaleasExcel(tradeExcelExportRequest);
            if(excelExportResult.isSuccess()){
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRecord(excelExportResult.getRspInfo());
            }else{
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc(excelExportResult.getRspInfo());
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
        }
        return webResult;
    }

    // 18B 门店商品配送统计报表 and 18C 商品定购收益报表
    @RequestMapping(value = "getCommodityOrderIncomePageList", method = {RequestMethod.GET, RequestMethod.POST})
    public TradeAreaPageResult<CommodityReportGridAreaDto> getCommodityOrderIncomePageList(HttpServletRequest request, CommodityReportAreaDto dto) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        TradeAreaPageResult<CommodityReportGridAreaDto> tradeAreaPageResult = new TradeAreaPageResult<>();
        //  门店编号， 门店名称， 门店状态
        StoreRequest storeRequest = new StoreRequest();
        if (StringUtil.isNotBlank(dto.getStoreNo()) || StringUtil.isNotBlank(dto.getStoreName())|| StringUtil.isNotBlank(dto.getShopStatus()) ) {
            storeRequest.setStoreCode(dto.getStoreNo());
            storeRequest.setStoreName(dto.getStoreName());
            storeRequest.setStoreStatus(dto.getShopStatus());
            MerchantResult<List<StoreDto>> merchantResult = storeFacade.getStoreList(storeRequest);
            List<Long> storeIds = new ArrayList<>();
            if (merchantResult.isSuccess()) {
                List<StoreDto> storeDtos = merchantResult.getData();
                for (StoreDto storeDto1 : storeDtos) {
                    storeIds.add(storeDto1.getStoreId());
                }
            }else{
                ErrorContext errorContext1 = merchantResult.getErrorContext();
                tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
                tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
            }
//            未找到对应门店
            if(CollectionUtils.isEmpty(storeIds)){
                tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
                tradeAreaPageResult.setRspInfo("未找到对应的门店。");
                return tradeAreaPageResult;
            }
            dto.setStoreIds(storeIds);
        }
        tradeAreaPageResult = reportAreaFacade.getCommodityOrderIncomePageList(dto);


        if(tradeAreaPageResult.isSuccess()&&CollectionUtils.isNotEmpty(tradeAreaPageResult.getRows())) {
            List<CommodityReportGridAreaDto> commodityReportGridAreaDtos  = tradeAreaPageResult.getRows();
            List<String> storeCodes  = new ArrayList<>();
            for (CommodityReportGridAreaDto commodityReportGridAreaDto : commodityReportGridAreaDtos) {
                if(StringUtils.isNotBlank(commodityReportGridAreaDto.getStoreNo())){
                    storeCodes.add(commodityReportGridAreaDto.getStoreNo());
                }
            }
            MerchantResult<List<StoreDto>> merchantResult   = storeFacade.getStoreListByCodes(storeCodes);
//
            //          dubbo 服务获取门店信息
            if(merchantResult.isSuccess()&&CollectionUtils.isNotEmpty(merchantResult.getData())){
//                 key storeNo ,  value storeDto
                Map<String , StoreDto> storeDtoMap  = new HashMap<>();
                List<StoreDto> storeDtos  = merchantResult.getData();
                for (StoreDto storeDto : storeDtos) {
//                    storeNo 唯一
                    storeDtoMap.put(storeDto.getStoreCode(),storeDto);
                }
                for (CommodityReportGridAreaDto commodityReportGridAreaDto : commodityReportGridAreaDtos) {
                    StoreDto storeDto = storeDtoMap.get(commodityReportGridAreaDto.getStoreNo());
                    if(null!=storeDto){
                        commodityReportGridAreaDto.setStoreAddress(storeDto.getDetailAddress());
                        commodityReportGridAreaDto.setStoreName(storeDto.getStoreName());
                        commodityReportGridAreaDto.setStoreTel(storeDto.getContactsTel());
                        commodityReportGridAreaDto.setStoreDeveloper(storeDto.getStoreDeveloper());
                    }

                }
            }

            tradeAreaPageResult.getFooter().get(0).setVendorName("当前页合计");
            tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
            return tradeAreaPageResult;
        }else{
            ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
            tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
            return tradeAreaPageResult;
        }
    }

    // 18B 门店商品配送统计报表导出 and 18C 商品定购收益报表
    @RequestMapping(value = "exportCommodityOrderIncomePageList", method = {RequestMethod.GET, RequestMethod.POST})
    public List<CommodityReportGridAreaDto> exportCommodityOrderIncomePageList(HttpServletRequest request, CommodityReportAreaDto dto) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
        TradeAreaPageResult<CommodityReportGridAreaDto> tradeAreaPageResult = new TradeAreaPageResult<>();
        //  门店编号， 门店名称， 门店状态
        StoreRequest storeRequest = new StoreRequest();
        if (StringUtil.isNotBlank(dto.getStoreNo()) || StringUtil.isNotBlank(dto.getStoreName())|| StringUtil.isNotBlank(dto.getShopStatus())){
            storeRequest.setStoreCode(dto.getStoreNo());
            storeRequest.setStoreName(dto.getStoreName());
            storeRequest.setStoreStatus(dto.getShopStatus());
            MerchantResult<List<StoreDto>> merchantResult = storeFacade.getStoreList(storeRequest);
            List<Long> storeIds = new ArrayList<>();
            if (merchantResult.isSuccess()) {
                List<StoreDto> storeDtos = merchantResult.getData();
                for (StoreDto storeDto1 : storeDtos) {
                    storeIds.add(storeDto1.getStoreId());
                }
            }else{
                ErrorContext errorContext1 = merchantResult.getErrorContext();
                tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
                tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
            }
//            未找到对应门店
            if(CollectionUtils.isEmpty(storeIds)){
                tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
                tradeAreaPageResult.setRspInfo("未找到对应的门店。");
                return tradeAreaPageResult.getRows();
            }
            dto.setStoreIds(storeIds);
        }

        tradeAreaPageResult = reportAreaFacade.getCommodityOrderIncomePageList(dto);
        if(tradeAreaPageResult.isSuccess()&&CollectionUtils.isNotEmpty(tradeAreaPageResult.getRows())) {
            List<CommodityReportGridAreaDto> commodityReportGridAreaDtos  = tradeAreaPageResult.getRows();
            List<String> storeCodes  = new ArrayList<>();
            for (CommodityReportGridAreaDto commodityReportGridAreaDto : commodityReportGridAreaDtos) {
                if(StringUtils.isNotBlank(commodityReportGridAreaDto.getStoreNo())){
                    storeCodes.add(commodityReportGridAreaDto.getStoreNo());
                }
            }
            MerchantResult<List<StoreDto>> merchantResult   = storeFacade.getStoreListByCodes(storeCodes);
//
            //          dubbo 服务获取门店信息
            if(merchantResult.isSuccess()&&CollectionUtils.isNotEmpty(merchantResult.getData())){
//                 key storeNo ,  value storeDto
                Map<String , StoreDto> storeDtoMap  = new HashMap<>();
                List<StoreDto> storeDtos  = merchantResult.getData();
                for (StoreDto storeDto : storeDtos) {
//                    storeNo 唯一
                    storeDtoMap.put(storeDto.getStoreCode(),storeDto);
                }
                for (CommodityReportGridAreaDto commodityReportGridAreaDto : commodityReportGridAreaDtos) {
                    StoreDto storeDto = storeDtoMap.get(commodityReportGridAreaDto.getStoreNo());
                    if(null!=storeDto){
                        commodityReportGridAreaDto.setStoreAddress(storeDto.getDetailAddress());
                        commodityReportGridAreaDto.setStoreName(storeDto.getStoreName());
                        commodityReportGridAreaDto.setStoreTel(storeDto.getContactsTel());
                        commodityReportGridAreaDto.setStoreDeveloper(storeDto.getStoreDeveloper());
                    }

                }
            }
            tradeAreaPageResult.getFooter().get(0).setVendorName("当前页合计");
            tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
            return tradeAreaPageResult.getRows();
        }else{
            ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
            tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
            return tradeAreaPageResult.getRows();
        }
    }


    //18D 商品配送报表
    @RequestMapping(value = "getSaleReport", method = {RequestMethod.GET, RequestMethod.POST})
    public TradeAreaPageResult<DistributionReportGridAreaDto> getSaleReport(HttpServletRequest request, DistributionReportAreaDto dto) {
        if(dto.getOrderEndDateTime() != null && dto.getOrderEndDateTime() != ""){
            dto.setOrderEndDateTime(dto.getOrderEndDateTime()+" 23:59:59");
        }
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        transWareHouser(dto);
        TradeAreaPageResult<DistributionReportGridAreaDto> tradeAreaPageResult = reportAreaFacade.getSaleReport(dto);
        if(tradeAreaPageResult.isSuccess()){
            tradeAreaPageResult.getFooter().get(0).setProductName("合计");
            tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
        }else{
            ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
            tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
        }

        return tradeAreaPageResult;
    }

    //18D 商品配送报表导出
    @RequestMapping(value = "downloadSaleReport", method = {RequestMethod.GET, RequestMethod.POST})
    public List<DistributionReportGridAreaDto> downloadSaleReport(HttpServletRequest request,DistributionReportAreaDto dto){
        if(dto.getOrderEndDateTime() != null && dto.getOrderEndDateTime() != ""){
            dto.setOrderEndDateTime(dto.getOrderEndDateTime()+" 23:59:59");
        }
        List<DistributionReportGridAreaDto> resuletList= new ArrayList<>();
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        transWareHouser(dto);
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
        TradeAreaPageResult<DistributionReportGridAreaDto> tradeAreaPageResult = reportAreaFacade.getSaleReport(dto);
        resuletList = tradeAreaPageResult.getRows();
        DistributionReportGridAreaDto distributionReportGridAreaDto = tradeAreaPageResult.getFooter().get(0);
        distributionReportGridAreaDto.setProductName("合计：");
        resuletList.add(distributionReportGridAreaDto);
        return resuletList;
    }

    private String trimStr(String str){
        if(StringUtil.isNotBlank(str)){
            return str.trim();
        }else{
            return str;
        }
    }
    //18D 商品配送报表导出(导出共享磁盘)
    @RequestMapping(value = "/distributionExcel",method = {RequestMethod.GET,RequestMethod.POST})
    public WebResult distributionExcel(DistributionReportAreaDto dto,HttpServletResponse response)throws IOException {
        WebResult webResult = new WebResult();
        String fileName = "区域商品配送_"+ TimeToolsUtil.getUserDate();
        String title = "兴盛电商-【兴盛优选】商品配送报表";
        String sheetName= "区域商品配送";
        String[] arrName = {"配送额排名", "发布时间", "商品编码", "商品名称", "规格", "供应商编码",
            "供应商", "订单量", "单价", "订货数量（份）", "配送金额", "每份门店提成", "平台服务费(份)", "门店提成",
            "平台服务费", "应付供应商"};

        String[] arrField = {"rowIndex", "expiryDateStart", "sku", "productName",
            "skuContent", "vendorCode", "vendorName", "shipmentQty", "price", "qty",
            "sumSalePrice", "commission", "platformAmt", "sumCommission", "sumPlatformAmt", "supplyPrice"};

        TradeExcelExportResult excelExportResult = new TradeExcelExportResult();
        TradeExcelExportRequest tradeExcelExportRequest = new TradeExcelExportRequest();

        try {
            dto.setRows(Integer.MAX_VALUE);
            dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            tradeExcelExportRequest.setObj(dto);
            tradeExcelExportRequest.setArrName(arrName);
            tradeExcelExportRequest.setArrField(arrField);
            tradeExcelExportRequest.setSheetName(sheetName);
            tradeExcelExportRequest.setFileName(fileName);
            tradeExcelExportRequest.setTitle(title);
            excelExportResult = reportAreaFacade.exportReportListExcel(tradeExcelExportRequest);
            if(excelExportResult.isSuccess()){
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRecord(excelExportResult.getRspInfo());
            }else{
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc(excelExportResult.getRspInfo());
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
        }
        return webResult;
    }

    /**
     * 5A 会员管理 /report/getAspnetUsersList
     */
    @RequestMapping(value = "getAspnetUsersList", method = {RequestMethod.GET, RequestMethod.POST})
    public TradeAreaPageResult<StoreUserDto> getAspnetUsersList(HttpServletRequest request, StoreMobQryDto storeMobQryDto) {
        storeMobQryDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        storeMobQryDto.setStoreName(trimStr(storeMobQryDto.getStoreName()));
        storeMobQryDto.setUserTel(trimStr(storeMobQryDto.getUserTel()));
        storeMobQryDto.setStoreNo(trimStr(storeMobQryDto.getStoreNo()));
        TradeAreaPageResult<StoreUserDto> tradeAreaPageResult  = new TradeAreaPageResult<>();
        if(StringUtil.isNotBlank(storeMobQryDto.getUserTel())) {
            UserResult userResult = userFacade.fuzzyQueryByMobileNo(storeMobQryDto.getUserTel());
            List<UserApiDto> userApiDtos = (List<UserApiDto>) userResult.getData();
            if (CollectionUtils.isEmpty(userApiDtos)) {
                tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
                tradeAreaPageResult.setRspInfo("未找到手机号对应的会员");
                tradeAreaPageResult.setRows(Lists.newArrayList());
                tradeAreaPageResult.setFooter(Lists.newArrayList());
                return tradeAreaPageResult;
            }
            List<Long> userIds = new ArrayList<>();
            for (UserApiDto userApiDto : userApiDtos) {
                userIds.add(userApiDto.getUserId());
            }
            storeMobQryDto.setUserIds(userIds);
        }

        tradeAreaPageResult  = reportAreaFacade.getStoreUserInfo(storeMobQryDto);
        if(tradeAreaPageResult.isSuccess()&&CollectionUtils.isNotEmpty(tradeAreaPageResult.getRows())){
            List<StoreUserDto> storeUserDtos  = tradeAreaPageResult.getRows();
            List<String> storeCodes  = new ArrayList<>();
            List<Long> userIds  = new ArrayList<>();
            for (StoreUserDto storeUserDto : storeUserDtos) {
                if(StringUtils.isNotBlank(storeUserDto.getStoreNo())){
                    storeCodes.add(storeUserDto.getStoreNo());
                }
                if(storeUserDto.getUserId()>0) {
                    userIds.add(storeUserDto.getUserId());
                }
            }
            MerchantResult<List<StoreDto>> merchantResult   = storeFacade.getStoreListByCodes(storeCodes);
//          dubbo 服务获取门店地址
            if(merchantResult.isSuccess()&&CollectionUtils.isNotEmpty(merchantResult.getData())){
//                 key storeNo ,  value storeDto
                Map<Long , StoreDto> storeDtoMap  = new HashMap<>();
                List<StoreDto> storeDtos  = merchantResult.getData();
                for (StoreDto storeDto : storeDtos) {
//                    storeNo 唯一
                    storeDtoMap.put(storeDto.getStoreId(),storeDto);
                }
                for (StoreUserDto storeUserDto : storeUserDtos) {
                    if(null!=storeDtoMap.get(storeUserDto.getStoreId())){
                        StoreDto storeDto  = storeDtoMap.get(storeUserDto.getStoreId());
                        storeUserDto.setStoreAddress(storeDto.getDetailAddress());
                        storeUserDto.setStoreName(storeDto.getStoreName());
                        storeUserDto.setStoreNo(storeDto.getStoreCode());
                    }
                }
            }
//          dubbo 服务获取 用户手机
            UserResult userResult = userFacade.findByUserIds(userIds);
            if (userResult.isSuccess()) {
                List<UserApiDto> userApiDtos = (List<UserApiDto>) userResult.getData();
                Map<Long, UserApiDto> userApiDtoMap = new HashMap<>();
                for (UserApiDto userApiDto : userApiDtos) {
                    userApiDtoMap.put(userApiDto.getUserId(), userApiDto);
                }

                for (StoreUserDto storeUserDto : storeUserDtos) {
                    if (null != userApiDtoMap.get(storeUserDto.getUserId())) {
                        storeUserDto.setUserTel(userApiDtoMap.get(storeUserDto.getUserId()).getMobileNo());
                        storeUserDto.setWechatName(userApiDtoMap.get(storeUserDto.getUserId()).getWechatNickName());
                    }
                }
            }

            tradeAreaPageResult.getFooter().get(0).setUserName("当前页合计");
            tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
        }else{
            ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
            if(errorContext1!=null&&StringUtil.isNotBlank(errorContext1.toString())) {
                tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
                tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
            }else {
                tradeAreaPageResult.setRspCode(ResponseCode.FAILED);
                tradeAreaPageResult.setRspInfo("没有数据。");
            }
            tradeAreaPageResult.setRows(Lists.newArrayList());
            tradeAreaPageResult.setFooter(Lists.newArrayList());
        }
        return tradeAreaPageResult;
    }

    @RequestMapping(value = "getProductSaleCollectList", method = {RequestMethod.GET, RequestMethod.POST})
    public Map getProductSaleCollect(HttpServletRequest request,ProductSaleCollectDto dto,int page,int rows){
        Map resultMap = new HashMap();
        dto.setPage(page);
        dto.setRows(rows);
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        if(dto.getExpiryDateEnd()!=null){
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(dto.getExpiryDateEnd());
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            dto.setExpiryDateEnd(calendar.getTime());
        }
        TradeAreaPageResult<ProductSaleCollectDto> tradeAreaPageResult = reportAreaFacade.getProductSaleCollect(dto);
        resultMap.put("rows", tradeAreaPageResult.getRows());
        resultMap.put("total", tradeAreaPageResult.getTotal());
        resultMap.put("footer", tradeAreaPageResult.getFooter());
        return resultMap;
    }

    @RequestMapping(value = "exportProductSaleCollectList", method = {RequestMethod.GET, RequestMethod.POST})
    public List<ProductSaleCollectDto> exportProductSaleCollectList(HttpServletRequest request,ProductSaleCollectDto dto){
        Map resultMap = new HashMap();
        List<ProductSaleCollectDto> productSaleCollectDtoList = new ArrayList<>();
        dto.setPage(1);
        dto.setRows(Integer.MAX_VALUE);
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        if(dto.getExpiryDateEnd()!=null){
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(dto.getExpiryDateEnd());
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            dto.setExpiryDateEnd(calendar.getTime());
        }
        TradeAreaPageResult<ProductSaleCollectDto> tradeAreaPageResult = reportAreaFacade.getProductSaleCollect(dto);
        productSaleCollectDtoList = tradeAreaPageResult.getRows();
        productSaleCollectDtoList.addAll(tradeAreaPageResult.getFooter());
        return productSaleCollectDtoList;
    }

    /**
     *
     * @param obj
     */
    private void transWareHouser(Object obj){

        if(obj instanceof StoreSaleasAreaDto){
            StoreSaleasAreaDto dto = (StoreSaleasAreaDto)obj;
            if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
                String warehouseIds = dto.getWarehouseIds();
                String[] warehouseAray = warehouseIds.split(",");
                dto.setWarehouseIdList(Arrays.asList(warehouseAray));
            }

        } else if (obj instanceof DistributionReportAreaDto ) {
            DistributionReportAreaDto dto = (DistributionReportAreaDto)obj;
            if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
                String warehouseIds = dto.getWarehouseIds();
                String[] warehouseAray = warehouseIds.split(",");
                dto.setWarehouseIdList(Arrays.asList(warehouseAray));
            }
        }


    }
}

