package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.common.utils.LogUtil;
import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.merchant.service.api.domain.request.StoreRequest;
import com.frxs.merchant.service.api.dto.DistributionLineDto;
import com.frxs.merchant.service.api.dto.StoreDto;
import com.frxs.merchant.service.api.facade.DistributionLineFacade;
import com.frxs.merchant.service.api.facade.StoreFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.promotion.service.api.dto.PickUpPreproductQueryDto;
import com.frxs.promotion.service.api.dto.PreproductDto;
import com.frxs.promotion.service.api.facade.AreaPreproductQueryFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import com.frxs.trade.service.api.OrderAreaPrintFacade;
import com.frxs.trade.service.api.OrderQryAreaFacade;
import com.frxs.trade.service.api.dto.StoreAreaDto;
import com.frxs.trade.service.api.dto.StoreProdQryAreaDto;
import com.frxs.trade.service.api.dto.TradeApiResult;
import com.frxs.trade.service.api.dto.base.ExcelDataDto;
import com.frxs.trade.service.api.dto.base.LineInfoDto;
import com.frxs.trade.service.api.dto.base.ProdInfoDto;
import com.frxs.trade.service.api.dto.base.StoreInfoDto;
import com.frxs.trade.service.api.dto.request.TradeExcelExportRequest;
import com.frxs.trade.service.api.dto.result.*;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.ExcelDataUtil;
import com.frxs.web.areaboss.utils.ExcelUtils;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;

import java.io.*;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jodd.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author fygu
 * @version $Id: StorePrintController.java,v 0.1 2018年03月23日 17:14 $Exp
 */
@Controller
@RequestMapping("/store")
public class StorePrintController {


    //@Reference(timeout = 30000,version = "1.0.0",check = false,url="dubbo://192.168.8.108:8206")
    @Reference(timeout = 30000, check = false,version = "1.0.0")
    private OrderQryAreaFacade orderQryAreaFacade;

    //@Reference(timeout = 30000,version = "1.0.0",check = false,url="dubbo://192.168.8.108:8206")
    @Reference(timeout = 1200000, check = false,version = "1.0.0")
    private OrderAreaPrintFacade orderAreaPrintFacade;

    @Reference(timeout = 30000, check = false,version = "1.0.0")
    private DistributionLineFacade distributionLineFacade;


    @Reference(check = false,version = "1.0.0")
    private StoreFacade storeFacade;

    @Reference(timeout = 30000, check = false,version = "1.0.0")
    private AreaPreproductQueryFacade areaPreproductQueryFacade;


    //门店商品配送打印
    @RequestMapping(value = "/printAspnetUsersSaleas", method = RequestMethod.GET)
    public String queryVendorPreproduct(ModelMap map, StoreProdQryAreaDto dto,HttpServletRequest request) {

        if(dto.getDeliveryStart()!=null){
            dto.setDeliveryEnd(getDate(dto.getDeliveryStart()));
        }

        //        仓库Id多选
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
        }

        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
//      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> storeAreaDtoResult = getStoreIds(dto);

        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = null;
        if(storeAreaDtoResult.isSuccess()) {
            TradeApiResult tradeApiResult = orderAreaPrintFacade.getOrderAreaItem(dto);
            map.addAttribute("tradeApiResult", tradeApiResult.getData());
            //fillResult(storeAreaDtoResult);
        }


        return "operationArea/printAspnetUsersSaleas";
    }

    //门店商品配送打印
    @RequestMapping(value = "/printAspnetUsersDistribution", method = RequestMethod.GET)
    public String printAspnetUsersDistribution(ModelMap map, StoreProdQryAreaDto dto,HttpServletRequest request) {

        if(dto.getDeliveryStart()!=null){
            dto.setDeliveryEnd(getDate(dto.getDeliveryStart()));
        }

        //        仓库Id多选
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
        }

        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
//      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> storeAreaDtoResult = getStoreIds(dto);

        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = null;
        if(storeAreaDtoResult.isSuccess()) {
            TradeApiResult tradeApiResult = orderAreaPrintFacade.getOrderAreaItem(dto);
            map.addAttribute("tradeApiResult", tradeApiResult.getData());
            //fillResult(storeAreaDtoResult);
        }


        return "operationArea/printAspnetUsersDistribution";
    }


    //送货线路商品汇总打印
    @RequestMapping(value = "/printAspnetUsersLine", method = RequestMethod.GET)
    public String printAspnetUsersLine(ModelMap map, StoreProdQryAreaDto dto,HttpServletRequest request) {

        if(dto.getDeliveryStart()!=null){
            dto.setDeliveryEnd(getDate(dto.getDeliveryStart()));
        }
        //        仓库Id多选
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
        }
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
//      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> storeAreaDtoResult = getStoreIds(dto);

        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = null;
        if(storeAreaDtoResult.isSuccess()) {
            TradeApiResult tradeApiResult = orderAreaPrintFacade.getOrderAreaLine(dto);
            map.addAttribute("tradeApiResult", tradeApiResult.getData());
            //fillResult(storeAreaDtoResult);
        }
        return "operationArea/printAspnetUsersLine";
    }

    private Date getDate(Date date){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        // 今天+1天
        c.add(Calendar.DAY_OF_MONTH, 1);
        return c.getTime();
    }

    private TradeAreaPageResult<StoreAreaDto> getStoreIds(StoreProdQryAreaDto dto){
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = new TradeAreaPageResult<>();
        StoreRequest storeRequest = new StoreRequest();
        if (StringUtil.isNotBlank(dto.getStoreNo()) || StringUtil.isNotBlank(dto.getStoreName())|| StringUtil.isNotBlank(dto.getShopStatus())) {
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
            } else {
                ErrorContext errorContext1 = merchantResult.getErrorContext();
                tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
                tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
                return tradeAreaPageResult;
            }
//            未找到对应门店
            if (CollectionUtils.isEmpty(storeIds)) {
                tradeAreaPageResult.setRspCode(ResponseCode.FAILED);
                tradeAreaPageResult.setRspInfo("未找到对应的门店信息。");
                return tradeAreaPageResult;
            }
            dto.setStoreIds(storeIds);
        }
        tradeAreaPageResult.setSuccess(true);
        tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
        return tradeAreaPageResult;
    }


    @RequestMapping(value = "downloadStoreUsersLine",method = {RequestMethod.GET,RequestMethod.POST})
    public void downloadStoreUsersLine(StoreProdQryAreaDto storeProdQryAreaDto, HttpServletRequest request,HttpServletResponse response) throws IOException {
        String fileName = "02线路配送列表.xlsx";

        ExcelMapResult result = new ExcelMapResult();
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        storeProdQryAreaDto.setCurrent(1);
        storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
//        storeProdQryAreaDto.setWarehouseIds(1);
        //调接口先根据仓库ID，返回线路列表以及线路下面的门店列表
        getWarehouseInfos(storeProdQryAreaDto);
        transWareHouser(storeProdQryAreaDto);

        result = orderAreaPrintFacade.downloadStoreUsersLine(storeProdQryAreaDto);

        ServletOutputStream out = response.getOutputStream();
        Map<String, List<List<ExcelDataDto>>> data = (Map<String, List<List<ExcelDataDto>>>) result.getData();
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/x-download");
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + fileName);

        try {
            ExcelUtils.writeExceltoFile(out, "xlsx", data);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "downloadStoreUsersLineExcel")
    @ResponseBody
    public WebResult downloadStoreUsersLineExcel(StoreProdQryAreaDto storeProdQryAreaDto, HttpServletRequest request) {
        WebResult webResult = new WebResult();
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());


        //调接口先根据仓库ID，返回线路列表以及线路下面的门店列表
        getWarehouseInfos(storeProdQryAreaDto);
        getProductInfos(storeProdQryAreaDto);
        transWareHouser(storeProdQryAreaDto);


        String fileName = "02线路配送列表" + TimeToolsUtil.getUserDate();

        TradeExcelExportResult excelExportResult = new TradeExcelExportResult();
        TradeExcelExportRequest excelExportRequest = new TradeExcelExportRequest();
        try {
            storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
            storeProdQryAreaDto.setCurrent(1);
            storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            excelExportRequest.setObj(storeProdQryAreaDto);
            excelExportRequest.setFileName(fileName);
            excelExportResult = orderAreaPrintFacade.downloadStoreUsersLineExcel(excelExportRequest);
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




    @RequestMapping(value = "downloadUserStoresLine",method = {RequestMethod.GET,RequestMethod.POST})
    public void downloadUserStoresLine(StoreProdQryAreaDto storeProdQryAreaDto, HttpServletRequest request,HttpServletResponse response) throws IOException {
        String fileName = "01线路配送列表.xlsx";

        ExcelMapResult result = new ExcelMapResult();
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        storeProdQryAreaDto.setCurrent(1);
        storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
//        storeProdQryAreaDto.setWarehouseIds("1");
        //调接口先根据仓库ID，返回线路列表以及线路下面的门店列表
        getWarehouseInfos(storeProdQryAreaDto);
        transWareHouser(storeProdQryAreaDto);


        result = orderAreaPrintFacade.downloadUserStoresLine(storeProdQryAreaDto);

        ServletOutputStream out = response.getOutputStream();
        Map<String, List<List<ExcelDataDto>>> data = (Map<String, List<List<ExcelDataDto>>>) result.getData();
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/x-download");
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + fileName);

        try {
            ExcelUtils.writeExceltoFile(out, "xlsx", data);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "downloadUserStoresLineExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public WebResult downloadUserStoresLineExcel(StoreProdQryAreaDto storeProdQryAreaDto, HttpServletRequest request, HttpServletResponse response){
        WebResult webResult = new WebResult();
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());


        //调接口先根据仓库ID，返回线路列表以及线路下面的门店列表
        getWarehouseInfos(storeProdQryAreaDto);
        getProductInfos(storeProdQryAreaDto);
        transWareHouser(storeProdQryAreaDto);

        String fileName = "01线路配送列表_" + TimeToolsUtil.getUserDate();

        TradeExcelExportResult excelExportResult = new TradeExcelExportResult();
        TradeExcelExportRequest excelExportRequest = new TradeExcelExportRequest();
        try {
            storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
            storeProdQryAreaDto.setCurrent(1);
            storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            excelExportRequest.setObj(storeProdQryAreaDto);
            excelExportRequest.setFileName(fileName);
            excelExportResult = orderAreaPrintFacade.downloadUserStoresLineExcel(excelExportRequest);
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


    private void getWarehouseInfos(StoreProdQryAreaDto storeProdQryAreaDto) {
        MerchantResult<Map<DistributionLineDto, List<StoreDto>>> merchantResult = distributionLineFacade.listDistributionLineAndStore(Integer.valueOf(storeProdQryAreaDto.getWarehouseIds()));
        Map<DistributionLineDto, List<StoreDto>>  map = merchantResult.getData();

        List<LineInfoDto> lines = new ArrayList<LineInfoDto>();

        for(DistributionLineDto key : map.keySet()){
            LineInfoDto line = new LineInfoDto();
            line.setLineId(key.getId());
            line.setLineName(key.getLineName());
            line.setAreaId(key.getAreaId());

            List<StoreDto> storeDtos = map.get(key);
            List<StoreInfoDto> stores = new ArrayList<StoreInfoDto>();
            for(StoreDto orgStore:storeDtos){
                StoreInfoDto store = new StoreInfoDto();
                store.setStoreNo(orgStore.getStoreCode());
                store.setStoreName(orgStore.getStoreName());
                store.setStoreId(orgStore.getStoreId());

                stores.add(store);
            }

            line.setStoreInfoLists(stores);
            lines.add(line);
        }

        //按照线路Id  排序
        Collections.sort(lines, new Comparator<LineInfoDto>() {
            @Override
            public int compare(LineInfoDto o1, LineInfoDto o2) {
                return (o1.getLineId() < o2.getLineId()) ? -1 : 1;
            }
        });

        storeProdQryAreaDto.setLineInfoLists(lines);

//        List<LineInfoDto> lines = new ArrayList<LineInfoDto>();
//
//        LineInfoDto line = new LineInfoDto();
//        line.setAreaId(101);
//        line.setLineId(134);
//        line.setLineName("测试");
//
//
//        List<StoreInfoDto> stores = new ArrayList<StoreInfoDto>();
//        StoreInfoDto store = new StoreInfoDto();
//        store.setAreaId(101);
//        store.setStoreId(Long.valueOf("66880000000109"));
//        store.setStoreName("lj测试门店");
//        stores.add(store);
//
//        StoreInfoDto store1 = new StoreInfoDto();
//        store1.setAreaId(101);
//        store1.setStoreId(Long.valueOf("66880000000137"));
//        store1.setStoreName("小铃铛测试门店");
//        stores.add(store1);
//
//        line.setStoreInfoLists(stores);
//        lines.add(line);
//        storeProdQryAreaDto.setLineInfoLists(lines);

    }


    /**
     * 获取活动对应的产品列表
     * @param storeProdQryAreaDto
     */
    private void getProductInfos(StoreProdQryAreaDto storeProdQryAreaDto) {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

        List<ProdInfoDto> prodInfoDtos = new ArrayList<ProdInfoDto>();

        PickUpPreproductQueryDto  queryDto = new PickUpPreproductQueryDto();
        queryDto.setAreaId(Long.valueOf(storeProdQryAreaDto.getAreaId()));
        try {
            queryDto.setTmPickUp(sf.parse(storeProdQryAreaDto.getDeliveryTimeStart()));
        } catch (ParseException e) {
            throw new RuntimeException("时间转换异常!");
        }
        PromotionBaseResult<List<PreproductDto>> preproduct=  areaPreproductQueryFacade.queryStoreLinePreproduct(queryDto);
        List<PreproductDto> preproductDtos = preproduct.getData();
        if(!preproductDtos.isEmpty()){
            for(PreproductDto dto:preproductDtos){
                ProdInfoDto prodInfoDto = new ProdInfoDto();
                prodInfoDto.setProductId(dto.getProductId());
                prodInfoDto.setProductName(dto.getProductName());
                prodInfoDto.setSku(dto.getSku());
                prodInfoDto.setItemDescription(dto.getNameSpec());
                prodInfoDtos.add(prodInfoDto);
            }
        }else{
            com.frxs.framework.util.common.log4j.LogUtil.error("获取活动对应的商品列表为空！");
            throw new RuntimeException("获取活动对应的商品列表为空!");
        }

        storeProdQryAreaDto.setProdInfoDtos(prodInfoDtos);

    }
    /**
     *      仓库Id多选
     * @param dto
     */
    private void transWareHouser(StoreProdQryAreaDto dto){
        if(com.frxs.sso.utils.StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
//            dto.setWarehouseIdList(Lists.newArrayList());
        }
    }



}
