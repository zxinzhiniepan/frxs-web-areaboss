package com.frxs.web.areaboss.controller.warehouse;

import com.frxs.merchant.service.api.dto.WarehouseDto;
import com.frxs.sso.rpc.RpcPermission;
import com.frxs.sso.sso.SessionPermission;
import com.frxs.sso.sso.SessionUtils;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author jiangboxuan
 * @version @version $Id: WarehouseController.java,v 0.1 2018年02月08日 上午 9:03 $Exp
 */

@Controller
@RequestMapping("/warehouse")
public class WarehouseController {

    @Autowired
    HttpServletRequest request;

    /**
     * 获取全部仓库
     */
    @RequestMapping(value = "/listWarehouse", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map listWarehouse(){
        Map resultMap = new HashMap();
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
                    resultMap.put("rows", list);
                }
            }



        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }

}
