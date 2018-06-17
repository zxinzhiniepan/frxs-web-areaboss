package com.frxs.web.areaboss.controller;

import com.frxs.web.areaboss.dto.MenuDto;
import com.frxs.web.areaboss.dto.ChildMenuDto;
import com.frxs.sso.rpc.RpcPermission;
import com.frxs.sso.sso.SessionPermission;
import com.frxs.sso.sso.SessionUser;
import com.frxs.sso.sso.SessionUtils;
import java.util.LinkedList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

import javax.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
/**
 * @author liudiwei
 * @version $Id: MenuWebApiController.java,v 0.1 2018年01月22日 下午 14:06 $Exp
 */
@RestController
@RequestMapping("/menu")
public class MenuWebApiController {

    private final Integer parentId = 57;

    @RequestMapping(value = "/getMenu", method = {RequestMethod.GET, RequestMethod.POST})
    public List<MenuDto> index(HttpServletRequest request) {
        SessionUser sessionUser = SessionUtils.getSessionUser(request);
        List<MenuDto> listMenuDto = new LinkedList<>();
        List<RpcPermission> rpcPermissionList = null;
        List<RpcPermission> rpcPermissionListOne = null;
        SessionPermission sessionPermission = SessionUtils.getSessionPermission(request);
        if (sessionPermission != null) {
            rpcPermissionList = sessionPermission.getMenuList();
            rpcPermissionListOne = sessionPermission.getckList();
            HttpSession session   =   request.getSession();
            session.setAttribute("rpcPermissionList",rpcPermissionList);
            session.setAttribute("rpcPermissionListOne",rpcPermissionListOne);
            session.setAttribute("sessionUser",sessionUser);
        }
        listMenuDto = listToList(rpcPermissionList);
        return listMenuDto;
    }


    private List<MenuDto> listToList(List<RpcPermission> rpcPermissionList) {
        List<MenuDto> listMenuDto = new LinkedList<>();
        if (rpcPermissionList == null && rpcPermissionList.size() == 0) {
            return listMenuDto;
        }

        for (RpcPermission rpcPermission : rpcPermissionList) {
            MenuDto menuDto = new MenuDto();
            Integer iParentId = rpcPermission.getParentId();
            if (parentId.equals(iParentId)) {
                menuDto.setSid(rpcPermission.getId());
                menuDto.setPid(0);
                menuDto.setModuleName(rpcPermission.getName());
                menuDto.setLink(rpcPermission.getUrl());
                listMenuDto.add(menuDto);
            }
        }
        for (MenuDto menuDto : listMenuDto) {
            List<ChildMenuDto> listChildMenu = new LinkedList<>();
            for (RpcPermission rpcPermission : rpcPermissionList) {
                Integer iParentId = rpcPermission.getParentId();
                ChildMenuDto childMenuDto = new ChildMenuDto();
                if (menuDto.getSid().equals(iParentId)) {
                    childMenuDto.setSid(rpcPermission.getId());
                    childMenuDto.setPid(rpcPermission.getParentId());
                    childMenuDto.setItemsName(rpcPermission.getName());
                    childMenuDto.setLink(rpcPermission.getUrl());
                    listChildMenu.add(childMenuDto);
                }
            }
            menuDto.setListChildMenu(listChildMenu);
        }

        return listMenuDto;
    }

    @RequestMapping(value = "/checkButton", method = {RequestMethod.GET, RequestMethod.POST})
    public Boolean checkButton(MenuDto menuDto,HttpServletRequest request) {
        SessionUser sessionUser = SessionUtils.getSessionUser(request);
        List<MenuDto> listMenuDto = new LinkedList<>();
        List<RpcPermission> rpcPermissionList = null;
        SessionPermission sessionPermission = SessionUtils.getSessionPermission(request);
        if (sessionPermission != null) {
            rpcPermissionList = sessionPermission.getMenuList();
        }
        if(rpcPermissionList!=null&&rpcPermissionList.size()>0){
            for(int i=0;i<rpcPermissionList.size();i++){
                int id = rpcPermissionList.get(i).getId();
                int sid = menuDto.getSid();
                if(id==sid){
                    return true;
                }
            }
        }
        return false;
    }
}
