package com.frxs.web.areaboss.controller.store;
import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.fund.service.api.domain.dto.store.StoreBalanceQueryDto;
import com.frxs.fund.service.api.domain.request.store.StoreBalanceRequest;
import com.frxs.fund.service.api.domain.result.store.StoreBalanceResult;
import com.frxs.fund.service.api.facade.store.StoreBalanceFacade;
import com.frxs.sso.sso.SessionUser;
import com.frxs.sso.sso.SessionUtils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/*
*
 * @author wang.zhen
 * @version $Id: TradeController.java,v 0.1 2018年02月07日 18:41 $Exp
*/


@Controller
@RequestMapping("/report")
public class StoreBalanceController {
    @Reference(check = false,version = "1.0.0",timeout = 60000)
    private StoreBalanceFacade storeBalanceFacade;

    @RequestMapping(value={"/getStoreBalanceAmountList"},method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Map getStoreBalanceAmountList(StoreBalanceRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        try{
            Page page1=new Page(request.getPage(),request.getRows());
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            StoreBalanceResult result= storeBalanceFacade.queryStoreBalancePage(page1,request);
            resultMap.put("rows",result.getStoreBalanceDtos());
            resultMap.put("total",result.getTotal());
            StoreBalanceResult result1=storeBalanceFacade.sumStore(request);
            List list=new ArrayList();
            if(result1!=null && result1.getStoreBalanceDto()!=null){
                StoreBalanceQueryDto storeBalanceDto = result1.getStoreBalanceDto();
                storeBalanceDto.setStoreName("合计");
                list.add(storeBalanceDto);
            }
            resultMap.put("footer",list);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
         * 导出明细
         * @param
    **/
    @RequestMapping(value={"/downloadStoreBalanceAmountList"}, method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<StoreBalanceQueryDto> exportDetail(StoreBalanceRequest request,HttpServletRequest request2){
        List<StoreBalanceQueryDto> resultList=null;
        try{
            Page page1 = new Page(1,Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            StoreBalanceResult result = storeBalanceFacade.queryStoreBalancePage(page1,request);
            resultList = result.getStoreBalanceDtos();
            StoreBalanceResult result1=storeBalanceFacade.sumStore(request);
            if(result1!=null && result1.getStoreBalanceDto()!=null){
                StoreBalanceQueryDto storeBalanceDto = result1.getStoreBalanceDto();
                storeBalanceDto.setStoreName("合计");
                resultList.add(storeBalanceDto);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultList;
    }
}
