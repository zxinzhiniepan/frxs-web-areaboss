/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 *//*


package com.frxs.web.areaboss.handler;

import com.frxs.web.areaboss.result.WebResult;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

*/
/**
 * Controller异常统一处理
 *
 * @author sh
 * @version $Id: ControllerExceptionHandler.java,v 0.1 2018年03月08日 下午 14:39 $Exp
 *//*

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler
    @ResponseBody
    public WebResult errorHandler(HttpServletRequest req, HttpServletResponse res, Exception e) {

        return CommonExceptionHandler.webError(req, res, e);
    }
}
*/
