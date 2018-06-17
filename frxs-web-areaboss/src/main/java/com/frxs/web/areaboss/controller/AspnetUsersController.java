package com.frxs.web.areaboss.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author jiangboxuan
 * @version AspnetUsersController.java, v1.0
 * @create 2018/1/24 0024  上午 11:17
 */

@Controller
@RequestMapping("/aspnetUsers")
public class AspnetUsersController {
    /**会员管理*/
    @RequestMapping(value = {"/aspnetUsers"}, method = RequestMethod.GET)
    public String selectAspnetUsers(ModelMap map) {
        return "aspnetUsers/aspnetUsers";
    }
}
