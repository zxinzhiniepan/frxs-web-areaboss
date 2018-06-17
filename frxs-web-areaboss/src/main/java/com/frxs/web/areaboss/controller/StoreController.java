package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.integration.oss.OssService;
import com.frxs.merchant.service.api.dto.DistributionLineDto;
import com.frxs.merchant.service.api.dto.StoreDto;
import com.frxs.merchant.service.api.dto.StoreLineDto;
import com.frxs.merchant.service.api.dto.WarehouseDto;
import com.frxs.merchant.service.api.facade.DistributionLineFacade;
import com.frxs.merchant.service.api.facade.StoreFacade;
import com.frxs.merchant.service.api.facade.WarehouseFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.sso.rpc.RpcPermission;
import com.frxs.sso.sso.SessionPermission;
import com.frxs.sso.sso.SessionUtils;
import com.frxs.user.service.api.dto.UserDto;
import com.frxs.user.service.api.facade.UserFacade;
import com.frxs.user.service.api.result.UserResult;
import com.frxs.web.areaboss.dto.WareHouseDto;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 门店管理
 *
 * @author wushuo
 * @version $Id: SupplierWebController.java,v 0.1 2018年01月25日 9:31 $Exp
 */
@Controller()
@RequestMapping("/storeProfile/")
public class StoreController {

    @Reference(check = false, version = "1.0.0",timeout = 30000)
    private StoreFacade storeFacade;

    @Reference(check = false, version = "1.0.0",timeout = 6000)
    private DistributionLineFacade distributionLineFacade;

    @Reference(check = false, version = "1.0.0",timeout = 6000)
    private WarehouseFacade warehouseFacade;

    @Reference(check = false, version = "1.0.0",timeout = 30000)
    private UserFacade userFacade;

    @Autowired
    private OssService ossService;

    /**
     * 门店主页面
     */
    @RequestMapping(value = "storeList")
    public String getList() {
        return "storeProfile/storeList";
    }


    /**
     * 添加/保存 门店页面返回
     */
    @RequestMapping(value = "addStore")
    public String addStore(ModelMap map, Long id, HttpServletRequest request) {
        if (id != 0) {
            WebResult<StoreDto> result = new WebResult<>();
            MerchantResult<StoreDto> merchantResult = storeFacade.getStoreById(id);
            if (merchantResult.isSuccess()) {
                MerchantResult<StoreLineDto> storeLineByStoreId = storeFacade
                    .getStoreLineByStoreId(id);
                merchantResult.getData().setLineSort(storeLineByStoreId.getData().getLineSort());

                MerchantResult<Long> userId = storeFacade.getUserId(id);
                UserResult byUserId = userFacade.findByUserId(userId.getData());
                UserDto userDto = (UserDto) byUserId.getData();
                merchantResult.getData().setUserName(userDto.getUserName());
                result.setRecord(merchantResult.getData());
                result.setRspCode(ResponseCode.SUCCESS);
                result.setRspDesc("find one store success");
            }
            map.addAttribute("result", result);
        }
        return "storeProfile/addStore";
    }

    /**
     * 编辑配送线路数据回填
     *
     * @param id 门店id
     */
    @RequestMapping(value = "getStoreLine", method = {RequestMethod.GET, RequestMethod.POST})
    public String getStoreLine(ModelMap map, Long id, HttpServletRequest request) {
        // 门店信息
        MerchantResult<StoreDto> storeResult = storeFacade.getStoreById(id.longValue());
        StoreDto storeDto = storeResult.getData();
        map.addAttribute("storeDto", storeDto);
        //仓库信息
        List<RpcPermission> rpcPermissionList = null;
        List<WarehouseDto> warehouseDtoList =new ArrayList<>();
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
                        WarehouseDto warehouseDto = new WarehouseDto();
                        warehouseDto.setWarehouseId(Integer.valueOf(rpcPermission.getUrl()));
                        warehouseDto.setWarehouseName(rpcPermission.getName());
                        warehouseDtoList.add(warehouseDto);
                    }
                }
            }
        }
        map.addAttribute("warehouseDtoList", warehouseDtoList);
        //门店的线路信息
        MerchantResult<StoreLineDto> storeLineByStoreId = storeFacade.getStoreLineByStoreId(id);
        map.addAttribute("storeLine", storeLineByStoreId.getData());
        // 线路信息
        DistributionLineDto distributionLineDto = new DistributionLineDto();
        distributionLineDto.setStatus(StatusEnum.NORMAL.getValueDefined());
        if (storeDto.getWarehouseId() == null) {
            storeDto.setWarehouseId(0);
        }
        distributionLineDto.setWarehouseId(storeDto.getWarehouseId());
        MerchantResult distributionLineResult = distributionLineFacade.listAll(distributionLineDto);
        List<DistributionLineDto> distributionLineDtoList = (List<DistributionLineDto>) distributionLineResult
            .getData();
        map.addAttribute("distributionLineDtoList", distributionLineDtoList);
        return "storeProfile/getStoreLine";
    }

    /**
     * 编辑银行信息数据回填
     */
    @GetMapping(value = "getStoreBankInfo")
    public String getStoreBankInfo(ModelMap map, Long id) {
        if (id != 0) {
            WebResult<StoreDto> result = new WebResult<>();
            MerchantResult<StoreDto> merchantResult = storeFacade.getStoreById(id.longValue());
            if (merchantResult.isSuccess()) {
                result.setRecord(merchantResult.getData());
                result.setRspCode(ResponseCode.SUCCESS);
                result.setRspDesc("find one store success");
            } else {
                result.setRspCode(ResponseCode.FAILED);
                result.setRspDesc("find one store failed");
            }
            map.addAttribute("result", result);
        }
        return "storeProfile/getStoreBankInfo";
    }

    /**
     * 批量导入页面
     */
    @RequestMapping(value = "loadUpLoadStoreView", method = {RequestMethod.GET, RequestMethod.POST})
    public String loadUploadStoreView(ModelMap map) {
        String url = ossService.getUrl() + "/excelTemplate/%E9%97%A8%E5%BA%97%E4%BF%A1%E6%81%AF-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88%28%E5%8C%BA%E5%9F%9F%29.xlsx";
        map.addAttribute("storeTemplateUrl",url);
        return "storeProfile/loadUpLoadStoreView";
    }
}