package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.common.domain.Money;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.util.common.log4j.LogUtil;
import com.frxs.fund.service.api.domain.dto.DictDto;
import com.frxs.fund.service.api.domain.dto.refund.StoreRefundBatchDto;
import com.frxs.fund.service.api.domain.dto.refund.StoreRefundDto;
import com.frxs.fund.service.api.domain.enums.StoreRefundEnum;
import com.frxs.fund.service.api.domain.request.export.ExcelExportRequest;
import com.frxs.fund.service.api.domain.request.refund.StoreRefundBatchRequest;
import com.frxs.fund.service.api.domain.request.refund.StoreRefundFirstCheckRequest;
import com.frxs.fund.service.api.domain.request.refund.StoreRefundQryRequest;
import com.frxs.fund.service.api.domain.result.export.ExcelExportResult;
import com.frxs.fund.service.api.domain.result.refund.StoreRefundBatchResult;
import com.frxs.fund.service.api.domain.result.refund.StoreRefundDetailResult;
import com.frxs.fund.service.api.domain.result.refund.StoreRefundFirstCheckResult;
import com.frxs.fund.service.api.domain.result.refund.StoreRefundQryResult;
import com.frxs.fund.service.api.facade.export.ExcelExportFacade;
import com.frxs.fund.service.api.facade.refund.StoreRefundFacade;
import com.frxs.merchant.service.api.dto.SysDictDetailDto;
import com.frxs.merchant.service.api.facade.SysDictDetailFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.sso.rpc.RpcPermission;
import com.frxs.sso.sso.SessionPermission;
import com.frxs.sso.sso.SessionUtils;
import com.frxs.trade.service.api.dto.ConsumerOrderItemDto;
import com.frxs.trade.service.api.dto.StoreProdQryAreaDto;
import com.frxs.trade.service.api.dto.base.ExcelDataDto;
import com.frxs.trade.service.api.dto.result.ExcelMapResult;
import com.frxs.web.areaboss.controller.enums.SysDictEnum;
import com.frxs.web.areaboss.dto.WareHouseDto;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.Constants;
import com.frxs.web.areaboss.utils.ExcelUtils;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.stream.Collectors;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import jodd.util.URLDecoder;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 门店售后审核
 *
 * @author fygu
 * @version $Id: StoreProductReturnController.java,v 0.1 2018年02月26日 13:32 $Exp
 */

@Controller
@RequestMapping("/storeProfile")
public class StoreProdReturnController {

    // @Reference(check = false, version = "1.0.0",timeout = 30000,url = "dubbo://192.168.8.108:28226")
    @Reference(check = false, version = "1.0.0",timeout = 30000)
    StoreRefundFacade storeRefundFacade;

    @Reference(check = false, version = "1.0.0",timeout = 30000)
    SysDictDetailFacade sysDictDetailFacade;

    //@Reference(check = false, version = "1.0.0",timeout = 30000,url = "dubbo://192.168.8.108:28226")
    @Reference(check = false, version = "1.0.0",timeout = 1800000 )
    ExcelExportFacade excelExportFacade;

    @Autowired
    HttpServletRequest request;

     /**
     * 门店售后审核列表查询
     *
     * @param page 分页数
     * @param rows 分页大小
     * @return smsList
     */
    @RequestMapping(value = "/getStoreProdReturnList", method = RequestMethod.POST)
    @ResponseBody
    public Map getVendorFineList(StoreRefundQryRequest storeRefundQryRequest,int page, int rows) {
        //页面没有时分秒格式，结束时间加一天
        if(storeRefundQryRequest.getTmAfterSaleEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmAfterSaleEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmAfterSaleEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmOrderEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmOrderEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmOrderEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmFirstCheckEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmFirstCheckEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmFirstCheckEnd(c.getTime());
        }

        StoreRefundQryResult storeRefundQryResult =null;
        Map resultMap = new HashMap();
        try {
            storeRefundQryRequest.setPage(page);
            storeRefundQryRequest.setRows(rows);
            storeRefundQryRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);

            storeRefundQryResult=storeRefundFacade.selectPageStoreRefund(storeRefundQryRequest);
            resultMap.put("rows", storeRefundQryResult.getRows());
            resultMap.put("footer", storeRefundQryResult.getFooter());
            resultMap.put("total", storeRefundQryResult.getTotal());
        } catch (Exception e) {
            resultMap.put("rows", "");
            e.printStackTrace();
        }
        return resultMap;
    }


    /**
     * 门店售后导出
     */
    @RequestMapping(value = "downloadStoreProductReturn", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public List<StoreRefundDto> downloadStoreProductReturn(StoreRefundQryRequest storeRefundQryRequest) {
        //页面没有时分秒格式，结束时间加一天
        if(storeRefundQryRequest.getTmAfterSaleEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmAfterSaleEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmAfterSaleEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmOrderEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmOrderEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmOrderEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmFirstCheckEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmFirstCheckEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmFirstCheckEnd(c.getTime());
        }

        StoreRefundQryResult storeRefundQryResult = null;
        List<StoreRefundDto> list = new LinkedList<>();
        try {
            storeRefundQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);
            storeRefundQryRequest.setRows(Integer.MAX_VALUE);
            storeRefundQryRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundQryResult = storeRefundFacade.exportRefundList(storeRefundQryRequest);
            list = storeRefundQryResult.getRows();
            list.addAll(storeRefundQryResult.getFooter());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


    @RequestMapping(value = "/createExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public WebResult createExcel(StoreRefundQryRequest storeRefundQryRequest,HttpServletResponse response){
        WebResult webResult = new WebResult();
        String fileName = "区域门店售后_"+ TimeToolsUtil.getUserDate();
        String title = "兴盛电商-【兴盛优选】售后日报表";
        String sheetName= "区域门店售后";
        String[] arrName = {"门店编号", "门店名称", "售后单号", "申请时间", "仓库", "商品编码", "商品名称",
            "精品日期", "售后类型", "售后数量", "供应商货款", "平台服务费", "门店提成", "售后金额合计", "状态",
            "供应商编码", "供应商名称", "货款划付单号", "货款划付状态	", "售后划付单号", "售后划付状态"	,
            "初审核人", "审核时间", "原订单编号", "订单时间"};

        String[] arrField = {"storeCode", "storeName", "storeRefundNo", "tmAfterSale", "warehouseName",
            "sku", "productName", "tmActivity", "firstCheckReasonTypeText", "firstCheckQty", "firstCheckVendorAmt",
            "firstCheckServicesFeeAmt", "firstCheckStoreAmt", "firstCheckSumAmt", "statusName", "vendorCode", "vendorName",
            "vendorAmtRemitDetailId", "vendorAmtRemitstatusName", "servicesFeeRemitDetailId", "servicesFeeRemitstatusName",
            "firstCheckerName", "tmFirstCheck", "orderNo", "orderDate"};

        //页面没有时分秒格式，结束时间加一天
        if(storeRefundQryRequest.getTmAfterSaleEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmAfterSaleEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmAfterSaleEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmOrderEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmOrderEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmOrderEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmFirstCheckEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmFirstCheckEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmFirstCheckEnd(c.getTime());
        }

        ExcelExportResult excelExportResult = new ExcelExportResult();
        ExcelExportRequest excelExportRequest = new ExcelExportRequest();
        try {
            storeRefundQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);
            storeRefundQryRequest.setRows(Integer.MAX_VALUE);
            storeRefundQryRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            excelExportRequest.setObj(storeRefundQryRequest);
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
            excelExportRequest.setTitle(title);
            excelExportResult = excelExportFacade.createExcelPath(excelExportRequest);
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

    @RequestMapping(value = "downloadStoreProdReturn",method = {RequestMethod.GET,RequestMethod.POST})
    public void downloadStoreUsersLine(StoreRefundQryRequest storeRefundQryRequest,HttpServletResponse response) throws IOException {

        String fileName = "区域门店售后_"+ TimeToolsUtil.getUserDate()+".xlsx";
        String title = "兴盛电商-【兴盛优选】售后日报表";
        //页面没有时分秒格式，结束时间加一天
        if(storeRefundQryRequest.getTmAfterSaleEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmAfterSaleEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmAfterSaleEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmOrderEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmOrderEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmOrderEnd(c.getTime());
        }
        if(storeRefundQryRequest.getTmFirstCheckEnd()!=null){
            Calendar c = Calendar.getInstance();
            c.setTime(storeRefundQryRequest.getTmFirstCheckEnd());
            c.add(Calendar.DAY_OF_MONTH, 1);
            storeRefundQryRequest.setTmFirstCheckEnd(c.getTime());
        }

        StoreRefundQryResult storeRefundQryResult = null;
        List<StoreRefundDto> list = new LinkedList<>();
        ServletOutputStream out = response.getOutputStream();
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/x-download");
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
        try {
            storeRefundQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);
            storeRefundQryRequest.setRows(Integer.MAX_VALUE);
            storeRefundQryRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeRefundQryResult = storeRefundFacade.exportRefundList(storeRefundQryRequest);
            list = storeRefundQryResult.getRows();
            list.addAll(storeRefundQryResult.getFooter());
            toExcel(out, "区域门店售后",title, list);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


     /**
     * 门店售后查看按钮跳转
     */
    @RequestMapping(value = "/storeProductReturnDetails", method = RequestMethod.GET)
    public String storeProductReturnDetails( ModelMap map,String storeRefundNo) {
        StoreRefundDetailResult storeRefundDetailResult = null;
        try {
            storeRefundDetailResult = storeRefundFacade.findStoreRefundByPK(storeRefundNo);
            if (storeRefundDetailResult != null) {
                map.addAttribute("entity", storeRefundDetailResult.getFundStoreWithdrawDto());
                map.addAttribute("listDto", storeRefundDetailResult.getListFundStoreRefundTrackDto());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "storeProfile/storeProductReturnDetails";
    }


/**
     * 门店售后审核按钮跳转
     */

    @RequestMapping(value = "/storeProductReturnAudit", method = RequestMethod.GET)
    public String storeProductReturnAudit( ModelMap map,String storeRefundNo) {
        StoreRefundDetailResult storeRefundDetailResult = null;
        try {
            storeRefundDetailResult = storeRefundFacade.findStoreRefundByPK(storeRefundNo);
            List<SysDictDetailDto> list = storeProdReturnType();
            if (storeRefundDetailResult != null) {
                map.addAttribute("dto", storeRefundDetailResult.getFundStoreWithdrawDto());
                Collections.sort(list, new Comparator<SysDictDetailDto>() {
                    @Override
                    public int compare(SysDictDetailDto h1, SysDictDetailDto h2) {
                        Integer dic1 = Integer.parseInt(h1.getDictValue());
                        Integer dic2 = Integer.parseInt(h2.getDictValue());
                        return dic1.compareTo(dic2);
                    }
                });
                map.addAttribute("list", list);
                map.addAttribute("listDto", storeRefundDetailResult.getListFundStoreRefundTrackDto());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "storeProfile/storeProductReturnAudit";
    }


    @RequestMapping(value = "getWarehouselist" ,method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map getWarehouselist(){
        Map resultMap = new HashMap();
        List<WareHouseDto> list =new LinkedList<>();
        try {
            List<RpcPermission> rpcPermissionList = null;
            SessionPermission sessionPermission = SessionUtils.getSessionPermission(request);
            if (sessionPermission != null) {
                rpcPermissionList = sessionPermission.getckList();
                Integer parentId = -1;
                if(rpcPermissionList!=null) {
                    for (RpcPermission rpcPermission :rpcPermissionList) {
                        String reginName = UserLoginInfoUtil.getRegionName(request);
                        if(reginName.equals(rpcPermission.getName())) {
                            parentId = rpcPermission.getId();
                        }
                        if(parentId.equals(rpcPermission.getParentId())){
                            WareHouseDto wareHouseDto = new WareHouseDto();
                            wareHouseDto.setWareHouseId(rpcPermission.getUrl());
                            wareHouseDto.setWareHouseName(rpcPermission.getName());
                            list.add(wareHouseDto);
                        }
                    }
                    resultMap.put("rows", list);
                }
            }



        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }


     /**
     * 门店售后信息跟踪
     *
     * @param storeRefundNo 供应商Id
     */
    @RequestMapping(value = "/getStoreAfterSaleDetails", method = RequestMethod.POST)
    @ResponseBody
    public WebResult getStoreAfterSaleDetails(String storeRefundNo ) {
        WebResult webResult = new WebResult();
        StoreRefundDetailResult storeRefundDetailResult = null;
        try {
            storeRefundDetailResult = storeRefundFacade.findStoreRefundByPK(storeRefundNo);
            if (storeRefundDetailResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRecord(storeRefundDetailResult.getFundStoreWithdrawDto());
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("操作失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return webResult;
    }



     /**
     * 门店售后审核
     *
     * @param formData
     * @return
     */
    @RequestMapping(value = "/auditStoreAfterSale", method = RequestMethod.POST)
    @ResponseBody
    public WebResult auditStoreAfterSale(StoreRefundDto formData) {
        formData.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        formData.setFirstCheckerId(UserLoginInfoUtil.getUserId(request));
        formData.setFirstCheckerName(UserLoginInfoUtil.getUserName(request));
        WebResult webResult = new WebResult();
        StoreRefundFirstCheckResult storeRefundFirstCheckResult = new StoreRefundFirstCheckResult();
        StoreRefundFirstCheckRequest storeRefundFirstCheckRequest = new StoreRefundFirstCheckRequest();
        try {
            storeRefundFirstCheckRequest.setRefundDto(formData);
            storeRefundFirstCheckResult = storeRefundFacade.checkFirst(storeRefundFirstCheckRequest);
            if (storeRefundFirstCheckResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRspDesc("操作成功");
            } else {
                //失败
                webResult.setRspDesc("操作失败");
                String rspInfo = storeRefundFirstCheckResult.getRspInfo();
                if(rspInfo!=null){
                        webResult.setRspDesc(rspInfo);
                }
                webResult.setRspCode(ResponseCode.FAILED);
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }



     /**
     * 门店售后信息跟踪
     *
     * @param storeRefundNo 供应商Id
     */

    @RequestMapping(value = "/getStoreAfterSaleTrackList", method = RequestMethod.POST)
    @ResponseBody
    public Map getStoreAfterSaleTrackList(String storeRefundNo ) {
        Map resultMap = new HashMap();
        StoreRefundDetailResult storeRefundDetailResult = null;
        try {
            storeRefundDetailResult = storeRefundFacade.findStoreRefundByPK(storeRefundNo);
            resultMap.put("rows", storeRefundDetailResult.getListFundStoreRefundTrackDto());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }


     /**
     * 门店售后客服关闭
     *
     * @param storeRefundNo 供应商Id
     */
    @RequestMapping(value = "/closeStoreAfterSale", method = RequestMethod.POST)
    @ResponseBody
    public WebResult closeStoreAfterSale(String storeRefundNo ) {
        WebResult webResult = new WebResult();
        StoreRefundBatchResult storeRefundBatchResult = new StoreRefundBatchResult();
        StoreRefundBatchRequest storeRefundBatchRequest = new StoreRefundBatchRequest();
        StoreRefundBatchDto storeRefundBatchDto = new StoreRefundBatchDto();
        try {
            List<String> storeRefundNoList = new LinkedList<>();
            storeRefundNoList.add(storeRefundNo);
            storeRefundBatchDto.setStatus(StoreRefundEnum.CUSTOMSERVICE_CLOSE.getValueDefined());
            storeRefundBatchDto.setListRefundNo(storeRefundNoList);
            storeRefundBatchDto.setOpUserId(UserLoginInfoUtil.getUserId(request));
            storeRefundBatchDto.setOpUserName(UserLoginInfoUtil.getUserName(request));
            storeRefundBatchDto.setTmAudit(new Date());
            storeRefundBatchDto.setAuditDesc("亲爱的老板，我们已与您充分沟通，您的售后申请将关闭。如有疑问，请直接联系客服，我们将竭诚为您服务，感谢您对兴盛优选的支持。");
            storeRefundBatchRequest.setStoreRefundDto(storeRefundBatchDto);
            storeRefundBatchResult = storeRefundFacade.batchCloseByCustomService(storeRefundBatchRequest);
            if (storeRefundBatchResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRspDesc("操作成功");
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("操作失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }

    /**
     * 6D 门店售后审核
     * 获取状态名称(枚举)
     * @return
     */
    @RequestMapping(value = "storeProdReturnStatus" ,method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<DictDto> storeProdReturnStatus(){

        List<DictDto> list = new ArrayList<>();
        try {
            list = StoreRefundEnum.getListStatus();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @RequestMapping(value = {"/vendorWithdrawalsInfo"}, method = RequestMethod.GET)
    public String vendorWithdrawalsInfo(ModelMap map) {
        return "financialAudit/vendorWithdrawalsInfo";
    }

    @RequestMapping(value = {"/storeWithdrawalsDetail"}, method = RequestMethod.GET)
    public String storeWithdrawalsDetail(ModelMap map) {
        return "financialAudit/storeWithdrawalsDetail";
    }


    /**
     * 6D 门店售后审核
     * 售后类型
     * @return
     */
    @RequestMapping(value = "storeProdReturnType" ,method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<SysDictDetailDto> storeProdReturnType(){
        List<SysDictDetailDto> list = new ArrayList<>();
        SysDictDetailDto req = new SysDictDetailDto();
        req.setAreaId(null);
        req.setDictCode(SysDictEnum.REFUND_TYPE.getDictCode());
        try {
            MerchantResult<List<SysDictDetailDto>> result = sysDictDetailFacade.listSysDictDetail(req);
            list = result.getData();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


    private void toExcel(OutputStream os,String sheetName, String title,List<StoreRefundDto> data) throws Exception {
        Workbook wb = new XSSFWorkbook();
        CellStyle cellStyle = null;
        Row row;
        Cell cell;
        try {
            CellStyle style = ExcelUtils.getStyle(wb);
            Sheet sheet = wb.createSheet(sheetName);
            row= sheet.createRow(0);
            String[] arr = {"门店编号", "门店名称", "售后单号", "申请时间", "仓库", "商品编码", "商品名称",
                "精品日期", "售后类型", "售后数量", "供应商货款", "平台服务费", "门店提成", "售后金额合计", "状态",
                "供应商编码", "供应商名称", "货款划付单号", "货款划付状态	", "售后划付单号", "售后划付状态"	,
                "初审核人", "审核时间", "原订单编号", "订单时间"	, "原门店提成划付单号"	, "原门店提成划付状态"
            };

            String[] arrField = {"storeCode", "storeName", "storeRefundNo", "tmAfterSale", "warehouseName",
                "sku", "productName", "tmActivity", "firstCheckReasonTypeText", "firstCheckQty", "firstCheckVendorAmt",
                "firstCheckServicesFeeAmt", "firstCheckStoreAmt", "firstCheckSumAmt", "statusName", "vendorCode", "vendorName",
                "vendorAmtRemitDetailId", "vendorAmtRemitstatus", "servicesFeeRemitDetailId", "servicesFeeRemitstatus",
                "firstCheckerName", "tmFirstCheck", "orderNo", "orderDate", "storeAmtRemitDetailId", "storeAmtRemitstatus"
            };

            for (int i = 0; i < arr.length; i++) {
                cell =row.createCell(i);
                cell.setCellValue(arr[i]);
            }
            int rowIndex = 1;
            if(data!=null&&data.size()>0) {
                for(StoreRefundDto t:data){
                  row = sheet.createRow(rowIndex++);
                    for (int i = 0; i < arrField.length; i++) {
                        cell =row.createCell(i);
                        setCel(cell,t,arrField[i]);
                    }
                }
            }
            wb.write(os);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (os != null) {
                os.close();
            }
        }

    }

    private void setCel(Cell cell,StoreRefundDto t,String fieldName) throws Exception{
        Field[] fields = t.getClass().getDeclaredFields();
        for(Field f:fields){
            f.setAccessible(true);
            if(fieldName.equals(f.getName())){
                if (f.getType().getName().equals(
                    java.lang.String.class.getName())) {
                    // String type
                    if(f.get(t)!=null) {
                        cell.setCellValue(f.get(t).toString());
                    }
                } else if (f.getType().getName().equals(
                    java.lang.Integer.class.getName())
                    ||f.getType().getName().equals("int")) {
                    // Integer type
                        cell.setCellValue(f.getInt(t));
                }else if (f.getType().getName().equals(
                    java.lang.Long.class.getName())
                    ||f.getType().getName().equals("long")) {
                    // Long type
                    cell.setCellValue(f.getLong(t));
                }else if (f.getType().getName().equals(
                    com.frxs.framework.common.domain.Money.class.getName())) {
                    // Money type
                    if(f.get(t)!=null) {
                        Money money = (Money) f.get(t);
                        cell.setCellValue(money.getAmount().toString());
                    }
                }else if (f.getType().getName().equals(
                    java.util.Date.class.getName())) {
                    // Date type
                    if(f.get(t)!=null) {
                        Date date = (Date) f.get(t);
                       // SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd hh:mm:ss");
                       // String dateString = formatter.format(date);
                        cell.setCellValue(date.toString());
                    }
                }
            }
            f.setAccessible(false);
        }
    }

}

