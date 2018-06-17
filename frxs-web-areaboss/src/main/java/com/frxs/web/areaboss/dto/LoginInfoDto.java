/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.dto;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *  LOGININFO API  DTO
 *
 * @author liudiwei
 * @version $Id: LoginInfoDto.java,v 0.1 2018年01月02日 下午 19:51 $Exp
 */
@Data
public class LoginInfoDto implements Serializable{
    /**
     *  serialVersionUID
     */
    private static final long serialVersionUID = 3042672899135862344L;

    private String userName;
    private String loginTime;
    private String loginArea;
    private String title;
}
