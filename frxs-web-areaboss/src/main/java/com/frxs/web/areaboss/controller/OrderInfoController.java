package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.util.common.StringUtil;
import com.frxs.sso.utils.StringUtils;
import com.frxs.trade.service.api.OrderAreaFacade;
import com.frxs.trade.service.api.dto.OrderItemAreaDto;
import com.frxs.trade.service.api.dto.orderManager.OrderDetailDto;
import com.frxs.trade.service.api.dto.orderManager.OrderGridAreaDto;
import com.frxs.trade.service.api.dto.orderManager.OrderItemQryAreaDto;
import com.frxs.trade.service.api.dto.orderManager.OrderItemQryAreaResult;
import com.frxs.trade.service.api.dto.orderManager.OrderQryAreaDto;
import com.frxs.trade.service.api.dto.orderManager.OrderQryAreaResult;
import com.frxs.trade.service.api.dto.request.TradeExcelExportRequest;
import com.frxs.trade.service.api.dto.result.TradeAreaPageResult;
import com.frxs.trade.service.api.dto.result.TradeExcelExportResult;
import com.frxs.trade.service.api.dto.result.TradeResult;
import com.frxs.user.service.api.dto.UserApiDto;
import com.frxs.user.service.api.dto.UserDto;
import com.frxs.user.service.api.facade.UserFacade;
import com.frxs.user.service.api.result.UserResult;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import com.google.common.collect.Lists;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
public class OrderInfoController {

//    @Reference(timeout = 30000, check = false,url="dubbo://127.0.0.1:8206",version = "1.0.0")
    @Reference(timeout = 300000, check = false,version = "1.0.0")
    private OrderAreaFacade orderAreaFacade;

//    @Reference( check = false,url="dubbo://127.0.0.1:8212")
    @Reference(timeout = 6000,check = false,version = "1.0.0")
    private UserFacade userFacade;

    //3A订单管理
    @RequestMapping(value = "getOrdersList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public TradeAreaPageResult<OrderGridAreaDto> getOrdersList(HttpServletRequest request, OrderQryAreaDto dto) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        TradeAreaPageResult<OrderGridAreaDto> tradeAreaPageResult = new TradeAreaPageResult<>();
        //          userTel ==> userId
        if(StringUtil.isNotBlank(dto.getMobilePin())) {
            UserResult userResult = userFacade.fuzzyQueryByMobileNo(dto.getMobilePin());

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
            dto.setUserIds(userIds);
        }

//        前端只关心 支付和未支付
        if(StringUtils.isNotBlank(dto.getPayStatus())){
            String payStatusStr  = dto.getPayStatus();
            String[] payStatusAray = payStatusStr.split(",");
            dto.setPayStatusList(Arrays.asList(payStatusAray));
        }
//        仓库Id多选
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
        }

        tradeAreaPageResult = orderAreaFacade.getOrdersList(dto);

       if(tradeAreaPageResult.isSuccess()){
           List<OrderGridAreaDto> orderGridAreaDtos = tradeAreaPageResult.getRows();

           List<Long> userIds  = new ArrayList<>();
           for (OrderGridAreaDto orderGridAreaDto : orderGridAreaDtos) {
               Long userId = orderGridAreaDto.getUserId();
               userIds.add(userId);
           }
           if(CollectionUtils.isNotEmpty(userIds)) {
               UserResult userResult = userFacade.findByUserIds(userIds);
               if (userResult.isSuccess()) {
                   List<UserApiDto> userApiDtos = (List<UserApiDto>) userResult.getData();
                   Map<Long, UserApiDto> userApiDtoMap = new HashMap<>();
                   for (UserApiDto userApiDto : userApiDtos) {
                       userApiDtoMap.put(userApiDto.getUserId(), userApiDto);
                   }

                   for (OrderGridAreaDto orderGridAreaDto : orderGridAreaDtos) {
                       if (null != userApiDtoMap.get(orderGridAreaDto.getUserId())) {
                           orderGridAreaDto.setMobilePin(userApiDtoMap.get(orderGridAreaDto.getUserId()).getMobileNo());
                       }
                   }
               }
           }
           tradeAreaPageResult.setRspCode(ResponseCode.SUCCESS);
       }else{
           ErrorContext errorContext1 = tradeAreaPageResult.getErrorContext();
           tradeAreaPageResult.setRspCode(errorContext1.fetchCurrentErrorCode());
           tradeAreaPageResult.setRspInfo(errorContext1.fetchCurrentError().getErrorMsg());
       }
        return tradeAreaPageResult;
    }

    //3A订单导出
    @RequestMapping(value = "/exportOrderList" ,method = {RequestMethod.GET, RequestMethod.POST})
    public List<OrderGridAreaDto> exportOrderList(HttpServletRequest request, OrderQryAreaDto dto) {
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setCurrent(1);
        dto.setRows(Integer.MAX_VALUE);
        TradeResult<List<OrderGridAreaDto>> tradeResult = new TradeResult<>();
        //          userTel ==> userId
        if(StringUtil.isNotBlank(dto.getMobilePin())) {
            UserResult userResult = userFacade.fuzzyQueryByMobileNo(dto.getMobilePin());

            List<UserApiDto> userApiDtos = (List<UserApiDto>) userResult.getData();
            if (CollectionUtils.isEmpty(userApiDtos)) {
                tradeResult.setSuccess(true);
                return Lists.newArrayList();
            }
            List<Long> userIds = new ArrayList<>();
            for (UserApiDto userApiDto : userApiDtos) {
                userIds.add(userApiDto.getUserId());
            }
            dto.setUserIds(userIds);
        }

        // 前端只关心 支付和未支付
        if(StringUtils.isNotBlank(dto.getPayStatus())){
            String payStatusStr  = dto.getPayStatus();
            String[] payStatusAray = payStatusStr.split(",");
            dto.setPayStatusList(Arrays.asList(payStatusAray));
        }
//        仓库Id多选
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
        }

        tradeResult = orderAreaFacade.getOrdersListForExport(dto);

       if(!tradeResult.isSuccess()){
           ErrorContext errorContext1 = tradeResult.getErrorContext();
           com.frxs.framework.util.common.log4j.LogUtil.error(errorContext1.toString());
       }
        return tradeResult.getData();
    }

    //3A订单导出【共享磁盘】
    @RequestMapping(value = "/exportOrderListExcel" ,method = {RequestMethod.GET, RequestMethod.POST})
    public WebResult exportOrderListExcel(HttpServletRequest request, OrderQryAreaDto dto) {
        WebResult webResult = new WebResult();

        //       先组装入参
        if(StringUtil.isNotBlank(dto.getMobilePin())) {
            UserResult userResult = userFacade.fuzzyQueryByMobileNo(dto.getMobilePin());

            List<UserApiDto> userApiDtos = (List<UserApiDto>) userResult.getData();
            if (CollectionUtils.isEmpty(userApiDtos)) {
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("未找到用户信息");
                return webResult;
            }
            List<Long> userIds = new ArrayList<>();
            for (UserApiDto userApiDto : userApiDtos) {
                userIds.add(userApiDto.getUserId());
            }
            dto.setUserIds(userIds);
        }

        // 前端只关心 支付和未支付
        if(StringUtils.isNotBlank(dto.getPayStatus())){
            String payStatusStr  = dto.getPayStatus();
            String[] payStatusAray = payStatusStr.split(",");
            dto.setPayStatusList(Arrays.asList(payStatusAray));
        }

//        仓库Id多选
        if(StringUtils.isNotBlank(dto.getWarehouseIds())) {
            String warehouseIds = dto.getWarehouseIds();
            String[] warehouseAray = warehouseIds.split(",");
            dto.setWarehouseIdList(Arrays.asList(warehouseAray));
        }


        String fileName = "订单管理_" + TimeToolsUtil.getUserDate() ;
        String sheetName= "订单导出";
        String[] arrName = {"下单时间", "提货日期", "订单编号", "提货单号", "会员电话", "昵称/姓名", "收货手机号",
            "门店分享ID", "门店名称", "门店编号", "付款状态", "订单状态", "商品编码", "商品名称", "供应商",
            "供应商编码", "规格", "总数量", "价格	", "配送金额", "每份提成",
            "门店总提成", "平台服务费(份)", "平台费合计", "付款时间", "是否为代客下单", "支付商户号", "支付回调单号","配送线路","配送顺序","仓库名称"};

        String[] arrField = {"orderDate", "deliveryTime", "orderId", "billOfLading", "userName",
            "wechatName", "phone", "storeId", "storeName", "storeNo", "payStatus",
            "orderStatus", "sku", "productName", "vendorName", "vendorCode", "skuContent",
            "totalOrdersAmt", "amount", "orderTotal", "commission",
            "totalCommission", "serviceCharge", "totalServiceCharge", "payDate","isValetOrder", "unionPayMid1", "transactionId", "lineName","lineSort", "warehouseName"};


        TradeExcelExportResult excelExportResult = new TradeExcelExportResult();
        TradeExcelExportRequest excelExportRequest = new TradeExcelExportRequest();
        try {
//            dto.setFooterFlag(Constants.SHOWFOOTER_ONE);
            dto.setRows(Integer.MAX_VALUE);
            dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            excelExportRequest.setObj(dto);
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
//            excelExportRequest.setTitle(title);
            excelExportResult = orderAreaFacade.exportOrderListExcel(excelExportRequest);
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

    //3A订单管理 订单详情
    @RequestMapping(value="getOrderItemsList",method={RequestMethod.POST})
    public  TradeResult<OrderDetailDto> getOrderItemsList(String orderId,HttpServletRequest request){
        OrderItemQryAreaDto dto = new OrderItemQryAreaDto();
        dto.setOrderId(orderId);
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        TradeResult<OrderDetailDto> result = orderAreaFacade.getOrderItemsList(dto);
        if(result.isSuccess()){
            //        塞入usertel
            OrderDetailDto orderDetailDto  = result.getData();
            Long userId =  orderDetailDto.getUserId() ;
            UserResult userResult = userFacade.findByUserId(userId);
            if(userResult.isSuccess()&&null!=userResult.getData()) {
                UserDto userDto = (UserDto) userResult.getData();
                orderDetailDto.setMobilePin(userDto.getMobileNo());
            }
        }

        return result;
    }
}
