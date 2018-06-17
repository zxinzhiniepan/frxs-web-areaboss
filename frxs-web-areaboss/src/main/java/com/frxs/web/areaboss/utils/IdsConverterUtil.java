/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */
package com.frxs.web.areaboss.utils;

import com.frxs.sso.sso.SessionUser;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author liudiwei
 * @version $Id: IdsConverterUtil.java,v 0.1 2018年1月30日 18:39 $Exp
 */
public class IdsConverterUtil {

    /**
     * ids转换
     */
    public static List<Long> IdsConverter(String ids){
        List<Long> idList = new ArrayList<>();
        if(ids!=null&&!"".equals(ids)){
            if(ids.contains("&")||ids.contains("=")){
                String idsArr [] = ids.split("&");
                for(int i = 0;i<idsArr.length;i++){
                    int s = idsArr[i].indexOf("=");
                    String id = idsArr[i].substring(s+1, idsArr[i].length());
                    idList.add(Long.parseLong(id));
                }
            }else {
                int s = ids.indexOf("=");
                String str = ids.substring(s+1, ids.length());
                idList.add(Long.parseLong(ids));
            }
        }
        return idList;
    }

    public static List<String> idsConverterString(String ids){
        List<String> idList = new ArrayList<>();
        if(ids!=null&&!"".equals(ids)){
            if(ids.contains("&")||ids.contains("=")){
                String idsArr [] = ids.split("&");
                for(int i = 0;i<idsArr.length;i++){
                    int s = idsArr[i].indexOf("=");
                    String id = idsArr[i].substring(s+1, idsArr[i].length());
                    idList.add(id);
                }
            }else {
                int s = ids.indexOf("=");
                String str = ids.substring(s+1, ids.length());
                idList.add(ids);
            }
        }
        return idList;
    }

}
