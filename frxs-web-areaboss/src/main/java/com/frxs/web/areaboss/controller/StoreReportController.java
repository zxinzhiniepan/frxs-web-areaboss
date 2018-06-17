
package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.util.common.log4j.LogUtil;
import com.frxs.merchant.service.api.domain.request.StoreRequest;
import com.frxs.merchant.service.api.dto.StoreDto;
import com.frxs.merchant.service.api.facade.StoreFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.sso.utils.StringUtils;
import com.frxs.trade.enums.PayStatusEnum;
import com.frxs.trade.service.api.OrderAreaPrintFacade;
import com.frxs.trade.service.api.OrderQryAreaFacade;
import com.frxs.trade.service.api.TradeExcelExportFacade;
import com.frxs.trade.service.api.dto.StoreAreaDto;
import com.frxs.trade.service.api.dto.StoreProdQryAreaDto;
import com.frxs.trade.service.api.dto.request.ExcelExportRequest;
import com.frxs.trade.service.api.dto.request.TradeExcelExportRequest;
import com.frxs.trade.service.api.dto.result.ExcelExportResult;
import com.frxs.trade.service.api.dto.result.TradeAreaPageResult;
import com.frxs.trade.service.api.dto.result.TradeExcelExportResult;
import com.frxs.user.service.api.dto.UserApiDto;
import com.frxs.user.service.api.facade.UserFacade;
import com.frxs.user.service.api.result.UserResult;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jodd.util.StringUtil;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author chenzuo
 * @version $Id: StoreController.java,v 0.1 2018年02月06日 11:10 $Exp
 */

@RestController
@RequestMapping("/store/")
public class StoreReportController {

//    @Reference(timeout = 30000,version = "1.0.0",check = false,url="dubbo://127.0.0.1:8206")
    @Reference(timeout = 600000, check = false,version = "1.0.0")
    private OrderQryAreaFacade orderQryAreaFacade;

//    @Reference(timeout = 30000,version = "1.0.0",check = false,url="dubbo://127.0.0.1:8206")
    @Reference(timeout = 60000, check = false,version = "1.0.0")
    private OrderAreaPrintFacade orderAreaPrintFacade;

    @Reference(timeout = 6000,check = false,version = "1.0.0")
    private StoreFacade storeFacade;

    @Reference(timeout = 6000,check = false,version = "1.0.0")
    private UserFacade userFacade;

//        @Reference(timeout = 30000,version = "1.0.0",check = false,url="dubbo://127.0.0.1:8206")
    @Reference(check = false, version = "1.0.0",timeout = 30000)
    TradeExcelExportFacade tradeExcelExportFacade;

    private TradeAreaPageResult<StoreAreaDto> getStoreIds(StoreProdQryAreaDto dto){
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = new TradeAreaPageResult<>();
        tradeAreaPageResult.setRows(new ArrayList<>());
        tradeAreaPageResult.setTotal(0);
        StoreRequest storeRequest = new StoreRequest();
        if (StringUtil.isNotBlank(dto.getStoreNo()) || StringUtil.isNotBlank(dto.getStoreName())|| StringUtil.isNotBlank(dto.getShopStatus())) {
            storeRequest.setStoreCode(dto.getStoreNo());
            storeRequest.setStoreName(dto.getStoreName());
            if(StringUtil.isNotBlank(dto.getShopStatus())) {
                if("1".equals(dto.getShopStatus())){
                    storeRequest.setStoreStatus(StatusEnum.NORMAL.getValueDefined());
                }else if("2".equals(dto.getShopStatus())){
                    storeRequest.setStoreStatus(StatusEnum.FROZEN.getValueDefined());
                }else{
                    storeRequest.setStoreStatus(StatusEnum.DELETE.getValueDefined());
                }
            }
            MerchantResult<List<StoreDto>> merchantResult = storeFacade.getStoreList(storeRequest);
            List<Long> storeIds = new ArrayList<>();
            if (merchantResult.isSuccess()) {
                List<StoreDto> storeDtos = merchantResult.getData();
                for (StoreDto storeDto1 : storeDtos) {
                    storeIds.add(storeDto1.getStoreId());
                }
            } else {
                ErrorContext errorContext1 = merchantResult.getErrorContext();
                if(null!=errorContext1&&StringUtil.isNotBlank(errorContext1.toString())) {
                    tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
                    tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
                }else{
                    tradeAreaPageResult.setRspCode(ResponseCode.FAILED);
                    tradeAreaPageResult.setRspInfo("getStoreIds:  获取门店id 异常");
                }

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

    private void fillResult(TradeAreaPageResult tradeAreaPageResult){
        if (tradeAreaPageResult.isSuccess()) {
            tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
        } else {
            ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
            tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
        }
    }

//    @RequestMapping(value = "testUserNum")
//    public TradeMobResult<StoreUserDto> testUserNum(String storeIds){
//        Map<Integer , List<Long>> map  = new HashMap<>();
//        String[] a = storeIds.split(",");
////
//        List<Long> list = new ArrayList<>();
//        for (int i = 0; i < a.length; i++) {
//            list.add(Long.parseLong(a[i]));
//        }
//        map.put(101,list);
//        TradeMobResult<StoreUserDto> b =  orderQryAreaFacade.getStoreList(map);
//        return orderQryAreaFacade.getUserNumByStore(map,2);
//    }

    /**
     *      仓库Id多选
     * @param dto
     */
    private void transWareHouser(StoreProdQryAreaDto dto){
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
//            dto.setWarehouseIdList(Lists.newArrayList());
        }
    }


   //7B 门店商品配送汇总
    @RequestMapping(value = "getUsersDistributionPageList")
    public TradeAreaPageResult<StoreAreaDto> getUsersDistributionPageList(StoreProdQryAreaDto dto,HttpServletRequest request) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());

        //        仓库Id多选
        transWareHouser(dto);

//         塞入门店ID
        if(dto.getDeliveryStart()!=null){
            dto.setDeliveryEnd(getDate(dto.getDeliveryStart()));
        }
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(dto);

        dto.setPayStatus(PayStatusEnum.HASPAY.getCode());
        if(tradeAreaPageResult.isSuccess()) {
            tradeAreaPageResult = orderQryAreaFacade.getStoreProds(dto);
            fillResult(tradeAreaPageResult);
        }
        return tradeAreaPageResult;
    }

    @RequestMapping(value = "exportUsersDistributionPageList")
    public List<StoreAreaDto> exportUsersDistributionPageList(StoreProdQryAreaDto dto,HttpServletRequest request) {
        if(dto.getDeliveryStart()!=null){
            dto.setDeliveryEnd(getDate(dto.getDeliveryStart()));
        }
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
        dto.setPayStatus(PayStatusEnum.HASPAY.getCode());

        //        仓库Id多选
        transWareHouser(dto);

//      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(dto);
        if(tradeAreaPageResult.isSuccess()) {
            tradeAreaPageResult = orderQryAreaFacade.getAllStoreProds(dto);
            fillResult(tradeAreaPageResult);
        }
        if(null!=tradeAreaPageResult.getFooter()) {
            tradeAreaPageResult.getRows().addAll(tradeAreaPageResult.getFooter());
        }
        return tradeAreaPageResult.getRows();
    }

    @RequestMapping(value = "/createUsersDistributionExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public WebResult createUsersDistributionExcel(HttpServletRequest request,StoreProdQryAreaDto dto){
        WebResult webResult = new WebResult();
        String fileName = "门店商品配送汇总_"+ TimeToolsUtil.getUserDate();
        String title = "兴盛电商-【兴盛优选】门店商品配送汇总";
        String sheetName= "门店商品配送汇总";
        String[] arrName = {"门店名称", "门店编号", "提货时间", "商品名称", "包装数", "订货数量", "总数量","配送线路", "配送仓库"};

        String[] arrField = {"storeName","storeNo","deliveryTime", "productName", "packingNumber",
            "qty", "totalQty", "lineName", "wareHouseName"};

        ExcelExportResult excelExportResult = null;
        ExcelExportRequest excelExportRequest = new ExcelExportRequest();
        try {
            if(dto.getDeliveryStart()!=null){
                dto.setDeliveryEnd(getDate(dto.getDeliveryStart()));
            }
            dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            dto.setCurrent(1);
            dto.setRows(Integer.MAX_VALUE);
            dto.setPayStatus(PayStatusEnum.HASPAY.getCode());

            //        仓库Id多选
            transWareHouser(dto);
            //      塞入门店ID
            getStoreIds(dto);
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
            excelExportRequest.setTitle(title);
            excelExportResult = tradeExcelExportFacade.createUsersDistributionExcel(excelExportRequest,dto);
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


    private Date getDate(Date date){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        // 今天+1天
        c.add(Calendar.DAY_OF_MONTH, 1);
        return c.getTime();
    }

//  7C 门店消费者订单
    @RequestMapping("getUsersSaleasPageList")
    public TradeAreaPageResult<StoreAreaDto> getUsersSaleasPageList(StoreProdQryAreaDto storeProdQryAreaDto,HttpServletRequest request) {
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());

        //        仓库Id多选
        transWareHouser(storeProdQryAreaDto);

        //      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(storeProdQryAreaDto);
        storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());
        if(tradeAreaPageResult.isSuccess()) {
            tradeAreaPageResult = orderQryAreaFacade.getUsersSaleasPageList(storeProdQryAreaDto);
            if(CollectionUtils.isNotEmpty(tradeAreaPageResult.getRows())){
                List<StoreAreaDto> storeAreaDtos = tradeAreaPageResult.getRows();
                List<Long> userIds  = new ArrayList<>();
                storeAreaDtos.forEach(item->{
//                    if(null!=item.getIsValetOrder()&&!item.getIsValetOrder()) {
                        userIds.add(item.getUserId());
//                    }
                });

                if(CollectionUtils.isNotEmpty(userIds)) {
                    UserResult userResult = userFacade.findByUserIds(userIds);
                    if (userResult.isSuccess()) {
                        List<UserApiDto> userApiDtos = (List<UserApiDto>) userResult.getData();
                        Map<Long, UserApiDto> userApiDtoMap = new HashMap<>();
                        for (UserApiDto userApiDto : userApiDtos) {
                            userApiDtoMap.put(userApiDto.getUserId(), userApiDto);
                        }
                        for (StoreAreaDto storeAreaDto : storeAreaDtos) {
//                           打印的时候手机号代客下单的 显示为空
                            if(storeProdQryAreaDto.getRows()>100){
                                storeAreaDto.setPhone("");
                                if(null!=storeAreaDto.getIsValetOrder()&&!storeAreaDto.getIsValetOrder()) {
                                    if (null != userApiDtoMap.get(storeAreaDto.getUserId())) {
                                        storeAreaDto.setPhone(userApiDtoMap.get(storeAreaDto.getUserId()).getMobileNo());
                                    }
                                }
                            }else {
                                if (null != userApiDtoMap.get(storeAreaDto.getUserId())) {
                                    storeAreaDto.setPhone(userApiDtoMap.get(storeAreaDto.getUserId()).getMobileNo());
                                } else {
//                                未找到 用户信息
                                    storeAreaDto.setPhone("");
//                                获取门店的客服电话
//                                MerchantResult<StoreDto> merchantResult  = storeFacade.getStoreById(storeAreaDto.getStoreId());
//                                StoreDto storeDto  = merchantResult.getData();
//                                storeAreaDto.setPhone(storeDto.getContactsTel());
//                                storeAreaDto.setBillOfLading();
                                }
                            }
                        }
                    }
                }
            }
            fillResult(tradeAreaPageResult);
        }
        return tradeAreaPageResult;
    }

    @RequestMapping("exportUsersSaleasPageList")
    public List<StoreAreaDto> exportUsersSaleasPageList(StoreProdQryAreaDto storeProdQryAreaDto,HttpServletRequest request) {
        List<StoreAreaDto> result = new ArrayList<>();
        storeProdQryAreaDto.setCurrent(1);
        storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
        storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getUsersSaleasPageList(storeProdQryAreaDto,request);
        if(tradeAreaPageResult.isSuccess()) {
            result = tradeAreaPageResult.getRows();
            result.addAll(tradeAreaPageResult.getFooter());
        }
        return result;
    }

    @RequestMapping(value = "/createUsersSaleasExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public WebResult createUsersSaleasExcel(HttpServletRequest request,StoreProdQryAreaDto storeProdQryAreaDto){
        WebResult webResult = new WebResult();
        String fileName = "门店消费者订单_"+ TimeToolsUtil.getUserDate();
        String title = "兴盛电商-【兴盛优选】门店消费者订单列表";
        String sheetName= "门店消费者订单列表";
        String[] arrName = {"门店名称", "门店编号", "配送仓库", "配送线路", "提货时间", "提货单号", "昵称",
            "手机号", "商品名称", "订货数量", "是否为代客下单"};

        String[] arrField = {"storeName","storeNo","wareHouseName", "lineName", "deliveryTime",
            "billOfLading", "wechatName", "phone", "productName", "qty", "isValetOrder"};

        ExcelExportResult excelExportResult = null;
        ExcelExportRequest excelExportRequest = new ExcelExportRequest();
        try {
            storeProdQryAreaDto.setCurrent(1);
            storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
            storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());
            storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());

            //        仓库Id多选
            transWareHouser(storeProdQryAreaDto);
            //      塞入门店ID
            getStoreIds(storeProdQryAreaDto);
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
            excelExportRequest.setTitle(title);
            excelExportResult = tradeExcelExportFacade.createUsersSaleasExcel(excelExportRequest,storeProdQryAreaDto);
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

//  7d  商品订购查询
    @RequestMapping("getUsersCommodityOrderPageList")
    public TradeAreaPageResult<StoreAreaDto> getUsersCommodityOrderPageList(StoreProdQryAreaDto storeProdQryAreaDto,HttpServletRequest request) {
        if(storeProdQryAreaDto.getDeliveryTimeEnd() != null && storeProdQryAreaDto.getDeliveryTimeEnd() != ""){
            storeProdQryAreaDto.setDeliveryTimeEnd(storeProdQryAreaDto.getDeliveryTimeEnd()+" 23:59:59");
        }
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        //      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(storeProdQryAreaDto);

        //        仓库Id多选
        transWareHouser(storeProdQryAreaDto);

        storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());
        if(tradeAreaPageResult.isSuccess()) {
            tradeAreaPageResult = orderQryAreaFacade.getUsersCommodityOrderPageList(storeProdQryAreaDto);
            fillResult(tradeAreaPageResult);
        }
        return tradeAreaPageResult;
    }

    @RequestMapping("exportUsersCommodityOrderPageList")
    public List<StoreAreaDto> exportUsersCommodityOrderPageList(StoreProdQryAreaDto storeProdQryAreaDto,HttpServletRequest request) {
        List<StoreAreaDto> result = new ArrayList<>();
        storeProdQryAreaDto.setCurrent(1);
        storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getUsersCommodityOrderPageList(storeProdQryAreaDto,request);
        if(tradeAreaPageResult.isSuccess()) {
            result = tradeAreaPageResult.getRows();
            result.addAll(tradeAreaPageResult.getFooter());
        }
        return result;
    }

    @RequestMapping(value = "/createUsersCommodityOrderExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public WebResult createUsersCommodityOrderExcel(HttpServletRequest request,StoreProdQryAreaDto storeProdQryAreaDto){
        WebResult webResult = new WebResult();
        String fileName = "商品订购查询_"+ TimeToolsUtil.getUserDate();
        String title = "兴盛电商-【兴盛优选】商品订购报表";
        String sheetName= "商品订购报表";
        String[] arrName = {"商品名称", "规格", "包装数", "订货数量", "总数量", "门店编号", "门店名称", "提货时间", "配送仓库"};

        String[] arrField = {"productName","skuContent","packingNumber", "qty", "totalQty","storeNo", "storeName", "deliveryTime", "wareHouseName"};

        ExcelExportResult excelExportResult = null;
        ExcelExportRequest excelExportRequest = new ExcelExportRequest();
        try {
            storeProdQryAreaDto.setCurrent(1);
            storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
            if(storeProdQryAreaDto.getDeliveryTimeEnd() != null && storeProdQryAreaDto.getDeliveryTimeEnd() != ""){
                storeProdQryAreaDto.setDeliveryTimeEnd(storeProdQryAreaDto.getDeliveryTimeEnd()+" 23:59:59");
            }
            storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            //      塞入门店ID
            TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(storeProdQryAreaDto);

            //        仓库Id多选
            transWareHouser(storeProdQryAreaDto);

            storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
            excelExportRequest.setTitle(title);
            excelExportResult = tradeExcelExportFacade.createUsersCommodityOrderExcel(excelExportRequest,storeProdQryAreaDto);
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

    @RequestMapping(value = "exportExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public void batchDownloadStoreQrCode(String fileName,HttpServletResponse response) {
        File file = new File(fileName);
        try {
            BufferedInputStream fis = new BufferedInputStream(new FileInputStream(file.getPath()));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            response.reset();
            ServletOutputStream out = response.getOutputStream();
            OutputStream toClient = new BufferedOutputStream(out);
            response.setContentType("application/octet-stream");
            String fName= null;
            if(fileName.contains("/")){
                fName=fileName.substring(fileName.lastIndexOf("/")+1);
            }else{
                fName=fileName.substring(fileName.lastIndexOf("\\")+1);
            }
            response.setHeader("Content-Disposition", "attachment;filename=" +
                new String(fName.getBytes("UTF-8"),"ISO-8859-1"));
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
            out.close();
            file.delete();
        } catch (Exception ex) {
            LogUtil.error("excel下载失败{}",ex.getMessage());
        } finally {
            if (file.exists()) {
                file.delete();
            }
        }
    }

//  7E 送货线路商品汇总表
    @RequestMapping("getUsersLinePageList")
    public  TradeAreaPageResult<StoreAreaDto> getUsersLinePageList(StoreProdQryAreaDto storeProdQryAreaDto,HttpServletRequest request) {
        storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());

        //        仓库Id多选
        transWareHouser(storeProdQryAreaDto);

        //      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(storeProdQryAreaDto);
        storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());
        if(tradeAreaPageResult.isSuccess()) {
            tradeAreaPageResult = orderQryAreaFacade.getUsersLinePageList(storeProdQryAreaDto);
            fillResult(tradeAreaPageResult);
        }
        return tradeAreaPageResult;
    }

    @RequestMapping("exportUsersLinePageList")
    public  List<StoreAreaDto> exportUsersLinePageList(StoreProdQryAreaDto storeProdQryAreaDto,HttpServletRequest request) {
        List<StoreAreaDto> result = new ArrayList<>();
        storeProdQryAreaDto.setCurrent(1);
        storeProdQryAreaDto.setRows(Integer.MAX_VALUE);

        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getUsersLinePageList(storeProdQryAreaDto,request);
        if(tradeAreaPageResult.isSuccess()) {
            result = tradeAreaPageResult.getRows();
            result.addAll(tradeAreaPageResult.getFooter());
        }
        return result;
    }

    @RequestMapping("exportUsersLinePageListExcel")
    public WebResult exportUsersLinePageListExcel(StoreProdQryAreaDto storeProdQryAreaDto, HttpServletRequest request) {
        WebResult webResult = new WebResult();

        //        仓库Id多选
        transWareHouser(storeProdQryAreaDto);

        //      塞入门店ID
        TradeAreaPageResult<StoreAreaDto> tradeAreaPageResult = getStoreIds(storeProdQryAreaDto);
        storeProdQryAreaDto.setPayStatus(PayStatusEnum.HASPAY.getCode());

        String fileName = "送货线路商品汇总_" + TimeToolsUtil.getUserDate() ;
        String sheetName= "送货线路商品汇总";
        String[] arrName = {"门店名称", "门店编号", "提货时间", "商品名称", "订货数量", "配送线路", "配送仓库"};

        String[] arrField = {"storeName", "storeNo", "deliveryTime", "productName", "qty",
            "lineName", "wareHouseName"};


        TradeExcelExportResult excelExportResult = new TradeExcelExportResult();
        TradeExcelExportRequest excelExportRequest = new TradeExcelExportRequest();
        try {
//            dto.setFooterFlag(Constants.SHOWFOOTER_ONE);
            storeProdQryAreaDto.setRows(Integer.MAX_VALUE);
            storeProdQryAreaDto.setCurrent(1);
            storeProdQryAreaDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            excelExportRequest.setObj(storeProdQryAreaDto);
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
//            excelExportRequest.setTitle(title);
            excelExportResult = orderQryAreaFacade.exportUsersLinePageListExcel(excelExportRequest);

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


}
