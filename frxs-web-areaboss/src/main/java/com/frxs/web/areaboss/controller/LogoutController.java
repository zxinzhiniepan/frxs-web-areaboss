package com.frxs.web.areaboss.controller;

import com.frxs.sso.model.ReferenceConfigMap;
import com.frxs.sso.rpc.AuthenticationRpcService;
import com.frxs.sso.sso.SsoFilter;
import com.frxs.sso.sso.SsoResultCode;
import com.frxs.sso.utils.SpringUtil;
import com.frxs.sso.utils.StringUtils;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author fygu
 * @version $Id: LogoutController.java,v 0.1 2018年03月09日 18:45 $Exp
 */
@Controller
public class LogoutController {

    @Autowired
    HttpServletRequest request;


    AuthenticationRpcService authenticationRpcService;


    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(String backUrl, HttpServletRequest request) {
        if (authenticationRpcService == null) {
            authenticationRpcService = (AuthenticationRpcService) SpringUtil.getBean(ReferenceConfigMap.class).get(AuthenticationRpcService.class.getName()).get();
        }
        String token = request.getParameter(SsoFilter.SSO_TOKEN_NAME);
        if (StringUtils.isNotBlank(token)) {
            authenticationRpcService.removeSession(token);
        }
        return "redirect:/home/index";
    }

    @RequestMapping(value = {"/changePwd"}, method = RequestMethod.GET)
    public String changePwd(ModelMap map) {
        return "home/changePwd";
    }

    @RequestMapping(value = "resetPwd", method = RequestMethod.POST)
    @ResponseBody
    public WebResult resetPwd(String pwd,String newPwd) {
        WebResult webResult = new WebResult();
        if (authenticationRpcService == null) {
            authenticationRpcService = (AuthenticationRpcService) SpringUtil.getBean(ReferenceConfigMap.class).get(AuthenticationRpcService.class.getName()).get();
        }
        Integer userId=  UserLoginInfoUtil.getUserId(request).intValue();
        Integer result =authenticationRpcService.resetPassword(userId,pwd,newPwd);
        if(result.equals(SsoResultCode.SUCCESS)){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("密码修改成功");
        }else{
            if(result.equals(SsoResultCode.SSO_PWD_ERROR)) {
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("原密码输入错误");
            }else{
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("密码修改失败");
            }
        }
        return webResult;
    }

}
