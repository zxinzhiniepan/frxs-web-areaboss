package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.web.excel.ExcelService;
import com.frxs.merchant.service.api.domain.request.StoreLineRequest;
import com.frxs.merchant.service.api.domain.request.StorePageRequest;
import com.frxs.merchant.service.api.domain.request.StoreRequest;
import com.frxs.merchant.service.api.dto.DistributionLineDto;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.dto.OrgAreaViewDto;
import com.frxs.merchant.service.api.dto.StoreDto;
import com.frxs.merchant.service.api.dto.StoreLineDto;
import com.frxs.merchant.service.api.dto.WarehouseDto;
import com.frxs.merchant.service.api.facade.AreaFacade;
import com.frxs.merchant.service.api.facade.DistributionLineFacade;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.merchant.service.api.facade.OrgAreaFacade;
import com.frxs.merchant.service.api.facade.StoreFacade;
import com.frxs.merchant.service.api.facade.WarehouseFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.trade.service.api.OrderQryAreaFacade;
import com.frxs.trade.service.api.dto.TradeMobResult;
import com.frxs.trade.service.api.dto.stat.StoreUserDto;
import com.frxs.trade.service.api.dto.stat.StoreUserQryDto;
import com.frxs.user.service.api.dto.StoreUserCountDto;
import com.frxs.user.service.api.facade.UserStoreFacade;
import com.frxs.user.service.api.result.UserResult;
import com.frxs.web.areaboss.dto.StoreExcelTemplateDto;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.CollectionUtils;
import com.frxs.web.areaboss.utils.QRCodeUtil;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import com.frxs.web.areaboss.utils.ZipCompressor;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.wuwenze.poi.hanlder.ReadHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author wushuo
 * @version $Id: StoreWebApiController.java,v 0.1 2018年02月06日 16:29 $Exp
 */
@RestController
@RequestMapping("/storeProfile/")
public class StoreWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    private StoreFacade storeFacade;

    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private DistributionLineFacade distributionLineFacade;

    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private WarehouseFacade warehouseFacade;

    @Reference(check = false,version = "1.0.0",timeout = 6000)
    private OrderQryAreaFacade orderQryAreaFacade;

    @Reference(check = false, version = "1.0.0",timeout = 6000)
    private OrgAreaFacade orgAreaFacade;

    @Reference(check = false, version = "1.0.0",timeout = 6000)
    private AreaFacade areaFacade;

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    private UserStoreFacade userStoreFacade;

    @Reference(check = false, version = "1.0.0",timeout = 3000)
    private OpLogFacade opLogFacade;

    @Value("${qr.code.url}")
    private String qrCodeUrl;

    @Autowired
    private ExcelService excelService;

    /**
     * 保存门店
     * @param storeDto
     */
    @PostMapping(value = "saveStore")
    public WebResult<StoreDto> saveStore(StoreDto storeDto,StoreLineDto storeLineDto,HttpServletRequest request){
        WebResult<StoreDto> result = new WebResult<>();
        Long storeId = storeDto.getStoreId();
        //校验门店账号
        if (storeId == 0) {
            MerchantResult<com.frxs.merchant.service.api.dto.StoreUserDto> merchantResult = storeFacade
                .getStoreUser(storeDto.getUserName());
            com.frxs.merchant.service.api.dto.StoreUserDto storeUserDto = merchantResult.getData();
            if (storeUserDto != null) {
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("门店账号已存在，请重新填写！");
                return result;
            }
        }
        StoreRequest storeRequest = new StoreRequest();
        //校验门店编号
        String storeCode = storeDto.getStoreCode();
        if (storeCode != null) {
            storeRequest.setStoreCode(storeCode);
            MerchantResult<List<StoreDto>> merchantResultByCode = storeFacade.getStoreListByStoreRequest(storeRequest);
            if(merchantResultByCode.isSuccess()){
                List<StoreDto> storeDtoByCodes = merchantResultByCode.getData();
                if (storeId == 0) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("门店编码已存在，请重新填写！");
                    return result;
                } else {
                    if(storeDtoByCodes.size() > 1){
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("门店数据异常！");
                        return result;
                    }
                    if (!storeDtoByCodes.get(0).getStoreId().equals(storeId)) {
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("门店编码已存在，请重新填写！");
                        return result;
                    }
                }
            }
        }

        //校验门店名称
        storeRequest = new StoreRequest();
        storeRequest.setStoreName(storeDto.getStoreName());
        MerchantResult<List<StoreDto>> merchantResultByName = storeFacade.getStoreListByStoreRequest(storeRequest);
        if(merchantResultByName.isSuccess()){
            List<StoreDto> storeDtoByNames = merchantResultByName.getData();
            if (storeId == 0) {
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("门店名称已存在，请重新填写！");
                return result;
            } else {
                if(storeDtoByNames.size() > 1){
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("门店数据异常！");
                    return result;
                }
                if (!storeDtoByNames.get(0).getStoreId().equals(storeId)) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("门店名称已存在，请重新填写！");
                    return result;
                }

            }

        }

        //添加
        if(storeId == 0){
            storeDto.setStoreStatus(StatusEnum.NORMAL.getValueDefined());
            storeDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            storeDto.setAreaName(UserLoginInfoUtil.getRegionName(request));
            storeDto.setCreateUserId(UserLoginInfoUtil.getUserId(request));
            storeDto.setCreateUserName(UserLoginInfoUtil.getUserName(request));
            storeLineDto.setLineId(0);
        }else {
            storeDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
            storeDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        }
        MerchantResult merchantResult = storeFacade.saveStore(storeDto, storeLineDto);
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("92");
        opLogDto.setMenuName("门店管理");
        if(storeId == 0){
            opLogDto.setAction("添加门店");
        }else {
            opLogDto.setAction("编辑门店");
        }
        opLogDto.setRemark(JSON.toJSONString(storeDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("保存成功");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc(errorContext.fetchCurrentError().getErrorMsg());
        }
        return result;
    }

    /**
     * 门店信息分页展示
     * @return
     */
    @RequestMapping(value = "getPageList",method = {RequestMethod.GET,RequestMethod.POST})
    public Map<String,Object> getPageList(StorePageRequest storePageRequest, HttpServletRequest request){
        Map<String,Object> resultMap = new HashMap<String,Object>(16);
        storePageRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        MerchantResult<Page<StoreDto>> merchantResult = storeFacade
            .getPageList(storePageRequest);
        List<StoreDto> storeDtos = merchantResult.getData().getRecords();

        if(storeDtos != null && storeDtos.size() != 0) {
            List<Long> storeIds = new ArrayList<>();
            Map<Integer, List<Long>> orderStoreMap = new HashMap<>();
            List<Long> userIds = new ArrayList<>();
            Map<Integer,StoreUserQryDto> orderUserMap = new HashMap<>();
            Set<Integer> areaIds = new HashSet<>();
            for (StoreDto storeDto : storeDtos) {
                areaIds.add(storeDto.getAreaId());
            }
            for (Integer areaId : areaIds) {
                for (StoreDto storeDto : storeDtos) {
                    Integer storeDtoAreaId = storeDto.getAreaId();
                    if (areaId.equals(storeDtoAreaId)) {
                        storeIds.add(storeDto.getStoreId());
                    }
                }
                orderStoreMap.put(areaId, storeIds);
                StoreUserQryDto storeUserQryDto = new StoreUserQryDto();
                storeUserQryDto.setStoreIds(storeIds);
                storeUserQryDto.setUserIds(userIds);
                orderUserMap.put(areaId,storeUserQryDto);
                storeIds = new ArrayList<>();
                userIds = new ArrayList<>();
            }

            boolean flag = true;

            //订单数
            TradeMobResult<StoreUserDto> orderNumByStore = orderQryAreaFacade
                .getOrderNumByStore(orderStoreMap);
            List<StoreUserDto> orderCounts = orderNumByStore.getData();
            if (orderCounts == null || orderCounts.size() == 0) {
                for (StoreDto storeDto : storeDtos) {
                    storeDto.setCountOrder(0D);
                }
            } else {
                for (StoreDto storeDto : storeDtos) {
                    for (StoreUserDto orderCount : orderCounts) {
                        if (storeDto.getStoreId().equals(orderCount.getStoreId())) {
                            storeDto.setCountOrder(orderCount.getOrderNum());
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        storeDto.setCountOrder(0D);
                    }
                    flag = true;
                }
            }

            //N次下单会员数
            TradeMobResult<StoreUserDto> userNumByStore = orderQryAreaFacade
                .getUserNumByStore(orderUserMap, storePageRequest.getUserOrderNumber());
            List<StoreUserDto> userNums = userNumByStore.getData();
            if (userNums == null || userNums.size() == 0) {
                for (StoreDto storeDto : storeDtos) {
                    storeDto.setCountUserOrder(0);
                }
            } else {
                for (StoreDto storeDto : storeDtos) {
                    for (StoreUserDto userNum : userNums) {
                        if (storeDto.getStoreId().equals(userNum.getStoreId())) {
                            storeDto.setCountUserOrder(userNum.getCnt());
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        storeDto.setCountUserOrder(0);
                    }
                    flag = true;
                }
            }

            //会员数
            for (StoreDto storeDto : storeDtos) {
                storeIds.add(storeDto.getStoreId());
            }
            UserResult userResult = userStoreFacade.findUserCount(storeIds, null, null);
            List<StoreUserCountDto> storeUserCountDtos = (List<StoreUserCountDto>) userResult
                .getData();
            if (storeUserCountDtos == null || storeUserCountDtos.size() == 0) {
                for (StoreDto storeDto : storeDtos) {
                    storeDto.setCountUserId(0);
                }
            } else {
                for (StoreDto storeDto : storeDtos) {
                    for (StoreUserCountDto storeUserCountDto : storeUserCountDtos) {
                        if (storeDto.getStoreId().equals(storeUserCountDto.getStoreId())) {
                            storeDto.setCountUserId(storeUserCountDto.getUserCount());
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        storeDto.setCountUserId(0);
                    }
                    flag = true;
                }
            }
        }
        resultMap.put("total",merchantResult.getData().getTotal());
        resultMap.put("rows",storeDtos);
        return resultMap;
    }

    /**
     * 保存配送路线信息
     * @return
     */
    @PostMapping(value = "updateStoreLine")
    public WebResult<StoreLineDto> updateStoreLine(StoreLineRequest storeLineRequest,HttpServletRequest request){
        WebResult<StoreLineDto> storeLineResult = new WebResult<>();
        MerchantResult merchantResult = storeFacade.saveStoreLine(storeLineRequest);
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("92");
        opLogDto.setMenuName("门店管理");
        opLogDto.setAction("更新门店线路");
        opLogDto.setRemark(JSON.toJSONString(storeLineRequest));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            storeLineResult.setRspCode(ResponseCode.SUCCESS);
            storeLineResult.setRspDesc("更新门店路线成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            storeLineResult.setRspCode(errorContext.fetchCurrentErrorCode());
            storeLineResult.setRspDesc("更新门店线路失败！");
        }
        return storeLineResult;
    }
    /**
     * 保存银行信息
     * @param storeDto
     * @return
     */
    @PostMapping(value = "updateStoreBankInfo")
    public WebResult<StoreDto> updateStoreBankInfo(StoreDto storeDto,HttpServletRequest request){
        WebResult<StoreDto> storeResult = new WebResult<>();
        storeDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        storeDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        MerchantResult merchantResult = storeFacade.updateOneStore(storeDto);
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("92");
        opLogDto.setMenuName("门店管理");
        opLogDto.setAction("更新门店银行信息");
        opLogDto.setRemark(JSON.toJSONString(storeDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            storeResult.setRspCode(ResponseCode.SUCCESS);
            storeResult.setRspDesc("更新门店银行账号信息成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            storeResult.setRspCode(errorContext.fetchCurrentErrorCode());
            storeResult.setRspDesc("更新门店银行账号信息失败！");
        }
        return storeResult;

    }

    /**
     * 导出excel
     * @return
     */
    @RequestMapping(value = "downloadStoreData")
    public List<StoreDto> downloadStoreData(StorePageRequest storePageRequest,HttpServletRequest request){
        storePageRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        //门店基本信息
        MerchantResult<List<StoreDto>> merchantResult = storeFacade
            .getList(storePageRequest);
        return merchantResult.getData();
    }

    /**
     * 批量导出二维码
     */
    @RequestMapping(value = "batchDownloadStoreQrCode")
    public WebResult batchDownloadStoreQrCode(String fileName,HttpServletResponse response)
        throws IOException {
        WebResult webResult = new WebResult();
        File file = new File(fileName);
        try {
            if (!file.exists()) {
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("未找到文件");
            }
            // 以流的形式下载文件。
            BufferedInputStream fis = new BufferedInputStream(new FileInputStream(file.getPath()));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            // 清空response
            response.reset();
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Disposition", "attachment;filename=" +
                new String(fileName.substring(fileName.lastIndexOf("/")+1).getBytes("UTF-8"),"ISO-8859-1"));
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
            file.delete();
            webResult.setRspCode(ResponseCode.SUCCESS);
        } catch (IOException ex) {
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("下载失败");
        } finally {
            if (file.exists()) {
                file.delete();
            }
        }
        return webResult;
    }

    @PostMapping(value = "getQrCodeUrl")
    public WebResult getQrCodeUrl(){
        WebResult result = new WebResult();
        result.setRecord(qrCodeUrl);
        return result;
    }

    private static final String ZIP_NAME = "门店分享二维码";

    private static final String DEST_PATH = "qrcode_temp_dir";
    /**
     * 生成二维码压缩
     * @param storePageRequest
     * @return
     */
    @PostMapping(value = "createBatchQRCodeZip")
    public WebResult CreateBatchQRCodeZip(StorePageRequest storePageRequest,HttpServletRequest request){
        storePageRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        WebResult webResult = new WebResult();
        MerchantResult<List<StoreDto>> merchantResult = storeFacade.getList(storePageRequest);
        List<StoreDto> storeDtos = merchantResult.getData();
        String[] file = new String[storeDtos.size()];
        try {
            if (storeDtos.size() != 0) {
                for (int i = 0; i < storeDtos.size(); i++) {
                    if (storeDtos.get(i) != null) {
                        file[i] = QRCodeUtil.encode(
                            storeDtos.get(i).getStoreCode() + "-" + storeDtos.get(i).getStoreName()
                            , qrCodeUrl+storeDtos.get(i).getStoreId(), null, DEST_PATH, true);
                    }
                }
            }
           /* String fileName = new String(
                (DEST_PATH+"/"+ZIP_NAME + "--" + TimeToolsUtil.getUserDate() + ".zip").getBytes("UTF-8"),
                "iso-8859-1");*/
            String fileName = DEST_PATH + "/" + ZIP_NAME + "--" +TimeToolsUtil.getUserDate()+ ".zip";
            ZipCompressor zc = new ZipCompressor(fileName);
            zc.compress(CollectionUtils.duplicate(file));
            for(String str:file){
                File dir=new File(str);
                dir.delete();

            }
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRecord(fileName);
            return webResult;
        } catch (Exception e) {
            webResult.setRspCode(ResponseCode.FAILED);
            return webResult;
        }
    }



    /**
     * 删除
     * @return
     */
    @PostMapping(value = "storeDelete")
    public WebResult<StoreDto> storeDelete(Long storeId,HttpServletRequest request){
        WebResult<StoreDto> storeResult = new WebResult<>();
        String storeStatus = StatusEnum.DELETE.getValueDefined();
        StoreDto storeDto = new StoreDto();
        storeDto.setStoreId(storeId);
        storeDto.setStoreStatus(storeStatus);
        storeDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        storeDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        MerchantResult merchantResult = storeFacade.updateOneStore(storeDto);
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("92");
        opLogDto.setMenuName("门店管理");
        opLogDto.setAction("删除门店");
        opLogDto.setRemark(JSON.toJSONString(storeDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            storeResult.setRspCode(ResponseCode.SUCCESS);
            storeResult.setRspDesc("删除成功！");
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            storeResult.setRspCode(errorContext.fetchCurrentErrorCode());
            storeResult.setRspDesc(errorContext.fetchCurrentError().getErrorMsg());
        }
        return storeResult;
    }


    /**
     * 冻结/解冻
     * @return
     */
    @PostMapping(value = "storeLock")
    public WebResult<StoreDto> storeLock(String ids,Long id,Integer status,HttpServletRequest request){
        WebResult<StoreDto> storeResult = new WebResult<>();
        String storeStatus = null;
        if(status == 1){
            storeStatus = StatusEnum.FROZEN.getValueDefined();
        }else if(status == 0){
            storeStatus = StatusEnum.NORMAL.getValueDefined();
        }
        MerchantResult merchantResult = null;
        StoreDto storeDto = new StoreDto();
        storeDto.setStoreStatus(storeStatus);
        storeDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        storeDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        if(ids == null){
            storeDto.setStoreId(id);
            merchantResult = storeFacade.updateOneStore(storeDto);
        }else {
            List<Long> storeIds = CollectionUtils.strToLongList(ids);
            storeDto.setStoreIds(storeIds);
            merchantResult = storeFacade.batchUpdateStatus(storeDto);
        }
        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("92");
        opLogDto.setMenuName("门店管理");
        if(status == 1){
            opLogDto.setAction("冻结门店");
        }else {
            opLogDto.setAction("解冻门店");
        }
        opLogDto.setRemark(JSON.toJSONString(storeDto));
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            storeResult.setRspCode(ResponseCode.SUCCESS);
            if(status == 1){
                storeResult.setRspDesc("冻结成功！");
            }else {
                storeResult.setRspDesc("解冻成功！");
            }
        }else {
            ErrorContext errorContext = merchantResult.getErrorContext();
            storeResult.setRspCode(errorContext.fetchCurrentErrorCode());
            if(status == 1){
                storeResult.setRspDesc("冻结失败！");
            }else {
                storeResult.setRspDesc("解冻失败！");
            }
        }
        return storeResult;
    }




    /**
     * 查询线路
     * @return
     */
    @RequestMapping(value = "distributionLine/getPageList",method = {RequestMethod.GET,RequestMethod.POST})
    public List<DistributionLineDto> getDistributionLineList(DistributionLineDto distributionLineDto){
        distributionLineDto.setStatus(StatusEnum.NORMAL.getValueDefined());
        MerchantResult merchantResult = distributionLineFacade.listAll(distributionLineDto);
        List<DistributionLineDto> result = (List<DistributionLineDto>) merchantResult.getData();
        return result;
    }

    /**
     * 查询仓库
     * @return
     */
    @RequestMapping(value = "getWarehouseList",method = {RequestMethod.GET,RequestMethod.POST})
    public List<WarehouseDto> getWarehouseList(HttpServletRequest request){
        WarehouseDto warehouseDto = new WarehouseDto();
        warehouseDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        MerchantResult merchantResult = warehouseFacade.listWarehouse(warehouseDto);
        List<WarehouseDto> result = (List<WarehouseDto>) merchantResult.getData();

        return result;
    }

    /**
     * 线路ids
     * @param storeId
     * @return
     */
   @PostMapping(value = "storeLineIdList")
    public WebResult<List<Integer>> storeLineIdList(Long storeId){
       WebResult<List<Integer>> result = new WebResult<>();
        MerchantResult<List<Integer>> merchantResult = storeFacade.getStoreLineIds(storeId);
        if(merchantResult.isSuccess()){
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRecord(merchantResult.getData());
        }
        return result;
   }

    private static final String LINE_SORT = "lineSort";

    @PostMapping(value = "editFiled")
    public WebResult editFiledByLineSort(String filed,Integer val,Long storeId,HttpServletRequest request){
        WebResult result = new WebResult();
        if(LINE_SORT.equals(filed)){
            MerchantResult<StoreLineDto> merchantResult = storeFacade.updateStoreLineSort(storeId, val);
            //添加日志维护信息
            StoreLineRequest storeLineRequest = new StoreLineRequest();
            storeLineRequest.setStoreId(storeId);
            storeLineRequest.setLineSort(val);
            OpLogDto opLogDto = new OpLogDto();
            opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            opLogDto.setMenuId("92");
            opLogDto.setMenuName("门店管理");
            opLogDto.setAction("修改线路顺序");
            opLogDto.setRemark(JSON.toJSONString(storeLineRequest));
            opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
            opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
            opLogFacade.createLog(opLogDto);
            if(merchantResult.isSuccess()){
                result.setRspCode(ResponseCode.SUCCESS);
                result.setRspDesc("修改门店线路顺序成功！");
                result.setRecord(merchantResult.getData().getLineSort());
            }else {
                if(merchantResult.getErrorContext() != null){
                    ErrorContext errorContext = merchantResult.getErrorContext();
                    result.setRspCode(errorContext.fetchCurrentErrorCode());
                    result.setRspDesc("修改门店线路顺序失败！");
                }else {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("该门店没有绑定线路！");
                }
            }
        }
        return result;
    }

    /**
     * 批量导入页面
     */
    @RequestMapping(value = "/loadUpLoadStore", method = {RequestMethod.POST})
    public WebResult loadUpLoadStore(@RequestParam("file1") MultipartFile file,
                                     HttpServletRequest request) throws Exception {
        List<StoreExcelTemplateDto> list = new ArrayList<StoreExcelTemplateDto>();
        List<Integer> bugRows = new ArrayList<Integer>();
        WebResult result = new WebResult();
        final Boolean[] flag = {true,false};
        excelService.importExcelFile(file, request, new ReadHandler() {
            boolean isNext = true;
            @Override
            public void handler(int sheetIndex, int rowIndex, List<String> row) {

                if(rowIndex == 0){
                    if (row.size() != 20) {
                        result.setRspCode(ResponseCode.FAILED);
                        isNext = false;
                        return;
                    }
                }
                //排除第一行
                if (isNext && rowIndex != 0) {
                    flag[1] = true;
                    if (row.size() != 20) {
                        flag[0] = false;
                        bugRows.add(rowIndex+1);
                        result.setRecord(bugRows);
                        result.setRspCode(ResponseCode.FAILED);
                        return;
                    }

                    for (int i = 0;i<=19;i++){
                        if (row.get(i)==null){
                            if (i != 13 && i != 14 && i != 15){
                                flag[0] = false;
                                bugRows.add(rowIndex+1);
                                result.setRecord(bugRows);
                                result.setRspCode(ResponseCode.FAILED);
                                return;
                            }
                        }
                    }

                    StoreExcelTemplateDto storeExcelTemplateDto = new StoreExcelTemplateDto();
                    storeExcelTemplateDto.setAreaName(UserLoginInfoUtil.getRegionName(request));
                    storeExcelTemplateDto.setStoreCode(row.get(0));
                    storeExcelTemplateDto.setStoreName(row.get(1));
                    storeExcelTemplateDto.setContacts(row.get(2));
                    storeExcelTemplateDto.setUserName(row.get(3));
                    storeExcelTemplateDto.setContactsTel(row.get(4));
                    storeExcelTemplateDto.setBusiLicenseFullName(row.get(5));
                    storeExcelTemplateDto.setShopArea(row.get(6));
                    storeExcelTemplateDto.setFoodCirculationLicense(row.get(7));
                    storeExcelTemplateDto.setProvince(row.get(8));
                    storeExcelTemplateDto.setCity(row.get(9));
                    storeExcelTemplateDto.setCounty(row.get(10));
                    storeExcelTemplateDto.setDetailAddress(row.get(11));
                    storeExcelTemplateDto.setWechatGroupName(row.get(12));
                    storeExcelTemplateDto.setStoreDeveloper(row.get(13));
                    storeExcelTemplateDto.setUnionPayCID(row.get(14));
                    storeExcelTemplateDto.setUnionPayMID(row.get(15));
                    storeExcelTemplateDto.setBankName(row.get(16));
                    storeExcelTemplateDto.setBankAccountName(row.get(17));
                    storeExcelTemplateDto.setBankAccountNo(row.get(18));
                    storeExcelTemplateDto.setBankNo(row.get(19));
                    list.add(storeExcelTemplateDto);
                }

            }
        });
        if (flag[0]&&flag[1]) {
            result.setRecord(list);
            result.setRspCode(ResponseCode.SUCCESS);
        }
        return result;
    }

    /**
     * 保存导入信息
     */
    @RequestMapping(value = "/saveUploadStoreProfileList", method = {RequestMethod.POST})
    public WebResult saveUploadStoreProfileList(HttpServletRequest request,@RequestParam("storeList") String storeList) {
        List<StoreExcelTemplateDto> list = JSON.parseArray(storeList, StoreExcelTemplateDto.class);
        //List<StoreExcelTemplateDto> list = cacheTool.findStoreExcelTemplateDtoListByKey("STORECACHE");
        WebResult result = new WebResult();
        List<StoreDto> storeDtos = new ArrayList<StoreDto>  ();
        for (int i = 0; i < list.size(); i++) {
            for (int j = i+1; j < list.size(); j++) {
                if (list.get(i).getStoreCode().equals(list.get(j).getStoreCode())) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("门店编号为【" + list.get(i).getStoreCode() + "】的信息有多条，请重新填写！");
                    return result;
                }
                if (list.get(i).getUserName().equals(list.get(j).getUserName())) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("门店账号为【" + list.get(i).getUserName() + "】的信息有多条，请重新填写！");
                    return result;
                }
                if (list.get(i).getStoreName().equals(list.get(j).getStoreName())) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("门店名称为【" + list.get(i).getStoreName() + "】的信息有多条，请重新填写！");
                    return result;
                }
            }
        }
        for (StoreExcelTemplateDto storeExcelTemplateDto : list) {
            StoreDto storeDto = new StoreDto();
            StoreLineDto storeLineDto = new StoreLineDto();
            storeDto.setStoreId(0L);
            storeDto.setAreaName(storeExcelTemplateDto.getAreaName());
            storeDto.setStoreCode(storeExcelTemplateDto.getStoreCode());
            storeDto.setStoreName(storeExcelTemplateDto.getStoreName());
            storeDto.setContacts(storeExcelTemplateDto.getContacts());
            storeDto.setUserName(storeExcelTemplateDto.getUserName());
            storeDto.setContactsTel(storeExcelTemplateDto.getContactsTel());
            storeDto.setBusiLicenseFullName(storeExcelTemplateDto.getBusiLicenseFullName());
            storeDto.setShopArea(storeExcelTemplateDto.getShopArea());
            storeDto.setFoodCirculationLicense(storeExcelTemplateDto.getFoodCirculationLicense());
            storeDto.setWechatGroupName(storeExcelTemplateDto.getWechatGroupName());
            storeDto.setStoreDeveloper(storeExcelTemplateDto.getStoreDeveloper());
            storeDto.setBankName(storeExcelTemplateDto.getBankName());
            storeDto.setBankAccountName(storeExcelTemplateDto.getBankAccountName());
            storeDto.setBankAccountNo(storeExcelTemplateDto.getBankAccountNo());
            storeDto.setBankNo(storeExcelTemplateDto.getBankNo());
            storeDto.setUnionPayCID(storeExcelTemplateDto.getUnionPayCID());
            storeDto.setUnionPayMID(storeExcelTemplateDto.getUnionPayMID());
            storeDto.setStoreStatus(com.frxs.merchant.service.api.enums.StatusEnum.NORMAL.getValueDefined());
            storeDto.setCreateUserId(UserLoginInfoUtil.getUserId(request));
            storeDto.setCreateUserName(UserLoginInfoUtil.getUserName(request));
            if(storeExcelTemplateDto.getProvince()==storeExcelTemplateDto.getCity()){
                storeDto.setDetailAddress(storeExcelTemplateDto.getCity()+storeExcelTemplateDto.getCounty()+storeExcelTemplateDto.getDetailAddress());
            }else {
                storeDto.setDetailAddress(storeExcelTemplateDto.getProvince()+storeExcelTemplateDto.getCity()+storeExcelTemplateDto.getCounty()+storeExcelTemplateDto.getDetailAddress());
            }
            OrgAreaViewDto orgAreaViewDto = new OrgAreaViewDto();
            orgAreaViewDto.setProvinceName(storeExcelTemplateDto.getProvince());
            orgAreaViewDto.setCityName(storeExcelTemplateDto.getCity());
            orgAreaViewDto.setCountyName(storeExcelTemplateDto.getCounty());
            orgAreaViewDto = orgAreaFacade.getByOrgAreaName(orgAreaViewDto).getData();
            if (orgAreaViewDto.getProvinceId() == null) {
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("【" + storeDto.getStoreCode() + "】的省市县填写错误，请重新填写！");
                return result;
            } else {
                storeDto.setProvinceId(orgAreaViewDto.getProvinceId());
                storeDto.setCityId(orgAreaViewDto.getCityId());
                storeDto.setCountyId(orgAreaViewDto.getCountyId());
            }

            Integer areaId = areaFacade.getAreaByAreaName(storeExcelTemplateDto.getAreaName()).getData().getAreaId();
            storeDto.setAreaId(areaId);
            Long storeId = storeDto.getStoreId();
            //校验门店账号
            if (storeId == 0 || storeId == null) {
                MerchantResult<com.frxs.merchant.service.api.dto.StoreUserDto> merchantResult = storeFacade
                    .getStoreUser(storeDto.getUserName());
                com.frxs.merchant.service.api.dto.StoreUserDto storeUserDto = merchantResult.getData();
                if (storeUserDto != null) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("【" + storeDto.getStoreCode() + "】的门店账号已存在，请重新填写！");
                    return result;
                }
            }
            StoreRequest storeRequest = new StoreRequest();
            //校验门店编号
            String storeCode = storeDto.getStoreCode();
            if (storeCode != null) {
                storeRequest.setStoreCode(storeCode);
                MerchantResult<List<StoreDto>> merchantResultByCode = storeFacade.getStoreListByStoreRequest(storeRequest);
                if(merchantResultByCode.isSuccess()){
                    List<StoreDto> storeDtoByCodes = merchantResultByCode.getData();
                    if (storeId == 0) {
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("【" + storeDto.getStoreCode() + "】的门店编码已存在，请重新填写！");
                        return result;
                    } else {
                        if(storeDtoByCodes.size() > 1){
                            result.setRspCode(ResponseCode.FAILED);
                            result.setRspDesc("编号为【" + storeDto.getStoreCode() + "】门店数据异常！");
                            return result;
                        }
                        if (!storeDtoByCodes.get(0).getStoreId().equals(storeId)) {
                            result.setRspCode(ResponseCode.FAILED);
                            result.setRspDesc("【" + storeDto.getStoreCode() + "】的门店编码已存在，请重新填写！");
                            return result;
                        }
                    }
                }
            }

            //校验门店名称
            storeRequest = new StoreRequest();
            storeRequest.setStoreName(storeDto.getStoreName());
            MerchantResult<List<StoreDto>> merchantResultByName = storeFacade.getStoreListByStoreRequest(storeRequest);
            if(merchantResultByName.isSuccess()){
                List<StoreDto> storeDtoByNames = merchantResultByName.getData();
                if (storeId == 0) {
                    result.setRspCode(ResponseCode.FAILED);
                    result.setRspDesc("【" + storeDto.getStoreCode() + "】的门店名称已存在，请重新填写！");
                    return result;
                } else {
                    if(storeDtoByNames.size() > 1){
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("编号为【" + storeDto.getStoreCode() + "】门店数据异常！");
                        return result;
                    }
                    if (!storeDtoByNames.get(0).getStoreId().equals(storeId)) {
                        result.setRspCode(ResponseCode.FAILED);
                        result.setRspDesc("【" + storeDto.getStoreCode() + "】的门店名称已存在，请重新填写！");
                        return result;
                    }
                }

            }
            storeDtos.add(storeDto);

        }
        MerchantResult merchantResult = storeFacade.saveStoreList(storeDtos);

        //添加日志维护信息
        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("92");
        opLogDto.setMenuName("门店管理");
        opLogDto.setAction("门店导入");
        if(storeDtos.size()>0){
            opLogDto.setRemark(JSON.toJSONString(storeDtos));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if (merchantResult.isSuccess()) {
            //list.clear();
            //cacheTool.deleteStoreExcelTemplateDtos("STORECACHE");
            result.setRecord("");
            result.setRspCode(ResponseCode.SUCCESS);
            result.setRspDesc("保存成功！");
        } else {
            result.setRecord("");
            ErrorContext errorContext = merchantResult.getErrorContext();
            result.setRspCode(errorContext.fetchCurrentErrorCode());
            result.setRspDesc("保存失败！");
        }

        return result;
    }

}
