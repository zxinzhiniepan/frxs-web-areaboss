/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */
package com.frxs.web.areaboss.utils;

import com.frxs.sso.sso.SessionUser;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author liudiwei
 * @version $Id: UserLoginInfoUtil.java,v 0.1 2018年1月30日 18:39 $Exp
 */
public class UserLoginInfoUtil {

    /**
     * 获取用户名
     */
    public static String getUserName(HttpServletRequest request){
        String userName = "";
        HttpSession session = request.getSession();
        SessionUser sessionUser = (SessionUser)session.getAttribute("_sessionUser");
        if(sessionUser!=null){
            userName = sessionUser.getAccount();
        }
        return userName;
    }

    /**
     * 获取用户Id
     */
    public static Long getUserId(HttpServletRequest request){
        Long userId = null;
        HttpSession session = request.getSession();
        SessionUser sessionUser = (SessionUser)session.getAttribute("_sessionUser");
        if(sessionUser!=null){
            userId = Long.valueOf(sessionUser.getUserId());
        }
        return userId;
    }

    /**
     * 获取区域Id
     */
    public static Long getRegionId(HttpServletRequest request){
        Long regionId = null;
        HttpSession session = request.getSession();
        SessionUser sessionUser = (SessionUser)session.getAttribute("_sessionUser");
        if(sessionUser!=null){
            regionId = Long.valueOf(sessionUser.getRegionId());
        }
        return regionId;
    }

    /**
     * 获取区域名称
     */
    public static String getRegionName(HttpServletRequest request){
        String regionName = "";
        HttpSession session = request.getSession();
        SessionUser sessionUser = (SessionUser)session.getAttribute("_sessionUser");
        if(sessionUser!=null){
            regionName = sessionUser.getRegionName();
        }
        return regionName;
    }
}
