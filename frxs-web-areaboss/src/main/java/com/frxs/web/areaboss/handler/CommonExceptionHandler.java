/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.handler;

import com.frxs.framework.util.common.log4j.LogUtil;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 异常统一处理
 *
 * @author sh
 * @version $Id: CommonExceptionHandler.java,v 0.1 2018年03月08日 下午 14:41 $Exp
 */
public class CommonExceptionHandler {

    /**
     * 构建公共错误信息
     *
     * @param req req
     * @param res res
     * @param e e
     * @return WebResult
     */
    public static WebResult webError(HttpServletRequest req, HttpServletResponse res, Exception e) {

        LogUtil.error(e, "异常统一处理");
        WebResult webResult = new WebResult();
        if (e instanceof IllegalArgumentException) {
            webResult.setRspCode(ResponseCode.ILLEG_ALARGUMENT_ERROR);
            webResult.setRspDesc(e.getMessage());
        } else {
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }
}
