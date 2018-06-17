package com.frxs.web.areaboss.controller.warehouse;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.merchant.service.api.dto.DistributionLineDto;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.dto.WarehouseDto;
import com.frxs.merchant.service.api.facade.DistributionLineFacade;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.sso.rpc.RpcPermission;
import com.frxs.sso.sso.SessionPermission;
import com.frxs.sso.sso.SessionUtils;
import com.frxs.web.areaboss.enums.StatusEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
/**
 * @author jiangboxuan
 * @version DistributionLineController.java, v1.0
 * @create 2018/1/24 0024  下午 13:59
 */
@Controller
@RequestMapping("/distributionLine")
public class DistributionLineController {

    @Autowired
    HttpServletRequest request;

    @Reference(check = false,version = "1.0.0",timeout = 60000)
    private DistributionLineFacade distributionLineFacade;

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    private OpLogFacade opLogFacade;

    @RequestMapping(value="/distributionLineList", method = RequestMethod.GET)
    public String distributionLineList(ModelMap map){
        return "distributionLine/distributionLineList";
    }


    /**
     * 获取商品列表
     */
    @RequestMapping(value = "/getPageList", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map getPageList(DistributionLineDto distributionLineDto, Integer page, Integer rows) {
        Map resultMap = new HashMap();
        distributionLineDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
         MerchantResult<Page<DistributionLineDto>> merchantResult = distributionLineFacade.listDistributionLine(distributionLineDto,page,rows);
        Page<DistributionLineDto> res = new Page<DistributionLineDto>();
        res = merchantResult.getData();
        List<DistributionLineDto> distributionLineDtoList = res.getRecords();
        resultMap.put("rows",distributionLineDtoList);
        resultMap.put("total",res.getTotal());
        return resultMap;
    }

    @RequestMapping(value = {"/editDistributionLine"}, method = RequestMethod.GET)
    public String editDistributionLine(ModelMap map,Integer id) {
        List<WarehouseDto> list =new LinkedList<>();
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
                            WarehouseDto warehouseDto = new WarehouseDto();
                            warehouseDto.setWarehouseId(Integer.valueOf(rpcPermission.getUrl()));
                            warehouseDto.setWarehouseName(rpcPermission.getName());
                            list.add(warehouseDto);
                        }
                    }
                }
            }



        } catch (Exception e) {
            e.printStackTrace();
        }
        map.addAttribute("warehouseDtoList",list);
        if(id!=0){
            DistributionLineDto distributionLineDto = new DistributionLineDto();
            MerchantResult<DistributionLineDto> merchantResult =
                distributionLineFacade.getDistributionLine(id);
            distributionLineDto = merchantResult.getData();
            map.addAttribute("distributionLineDto",distributionLineDto);
        }
        return "distributionLine/editDistributionLine";
    }

    @RequestMapping(value = "/saveDistributionLine", method = RequestMethod.POST)
    @ResponseBody
    public WebResult saveDistributionLine(DistributionLineDto distributionLineDto){
        distributionLineDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        distributionLineDto.setAreaName(UserLoginInfoUtil.getRegionName(request));
        distributionLineDto.setCreateUserId(UserLoginInfoUtil.getUserId(request));
        distributionLineDto.setCreateUserName(UserLoginInfoUtil.getUserName(request));
        distributionLineDto.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        distributionLineDto.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        WebResult webResult = new WebResult();
        DistributionLineDto dto = new DistributionLineDto();
        //线路名称在一个区域内不能重复
        dto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        dto.setLineName(distributionLineDto.getLineName());
        dto.setStatus(StatusEnum.NORMAL.getValueDefined());
        List<DistributionLineDto> distributionLineDtoList = (List<DistributionLineDto>) distributionLineFacade.listAll(dto).getData();
        if(distributionLineDto.getId() == 0){
            if (distributionLineDtoList.size()>0){
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("线路名称已存在，请重新填写！");
                return webResult;
            }
        }else {
            if(distributionLineDtoList.size()>0
                && !distributionLineDtoList.get(0).getId().equals(distributionLineDto.getId())){
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("线路名称已存在，请重新填写！");
                return webResult;
            }
        }

        MerchantResult<DistributionLineDto> merchantResult =
            distributionLineFacade.saveDistributionLine(distributionLineDto);

        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("76");
        opLogDto.setMenuName("配送线路管理模块");
        opLogDto.setAction("配送线路手动保存");
        if (distributionLineDto != null){
            opLogDto.setRemark(JSON.toJSONString(distributionLineDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("保存成功");
        }else{
            //失败
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public WebResult delete(DistributionLineDto distributionLineDto){
        Map<String,Object> res = new HashMap<String, Object>();
        WebResult webResult = new WebResult();
        distributionLineDto.setStatus(StatusEnum.DELETE.getValueDefined());
        MerchantResult merchantResult =
            distributionLineFacade.modifyState(distributionLineDto);

        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("76");
        opLogDto.setMenuName("配送线路管理模块");
        opLogDto.setAction("配送线路手动删除");
        if (distributionLineDto != null){
            opLogDto.setRemark(JSON.toJSONString(distributionLineDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("删除成功");
        }else{
            if (merchantResult.getData()==null){
                //失败
                ErrorContext errorContext1 = merchantResult.getErrorContext();
                webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
                webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
            } else {
                if (!(boolean)merchantResult.getData()){
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("该线路已被门店绑定，无法删除！");
                }
            }

        }
        return webResult;
    }

    /**
     * 获取全部线路
     */
    @RequestMapping(value = "/listDistributionLine", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map listDistributionLine(DistributionLineDto distributionLineDto) {
        Map resultMap = new HashMap();
        distributionLineDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        distributionLineDto.setStatus(StatusEnum.NORMAL.getValueDefined());
        MerchantResult<List<DistributionLineDto>> merchantResult = distributionLineFacade.listAll(distributionLineDto);
        List<DistributionLineDto> distributionLineDtoList= merchantResult.getData();
        resultMap.put("rows",distributionLineDtoList);
        return resultMap;
    }

    @RequestMapping(value = "/listDistributionLineByWarehouseId", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map listDistributionLineByWarehouseId(){
        Map resultMap = new HashMap();
        List<RpcPermission> rpcPermissionList = null;
        StringBuilder ids = new StringBuilder();
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
                        ids.append("id=").append(rpcPermission.getUrl()).append("&");
                    }
                }
            }
        }
        DistributionLineDto distributionLineDto = new DistributionLineDto();
        distributionLineDto.setIds(ids.toString());
        MerchantResult result = distributionLineFacade.listAll(distributionLineDto);
        resultMap.put("rows",result.getData());
        return resultMap;
    }

}
