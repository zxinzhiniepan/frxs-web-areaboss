/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 *  PRODUCT API  DTO
 *
 * @author liudiwei
 * @version $Id: productDto.java,v 0.1 2018年01月02日 下午 19:51 $Exp
 */
@Data
public class DistributionLineDto implements Serializable{
    private static final long serialVersionUID = 1L;

    /**
     * 路线ID
     */
    private Integer id;
    /**
     * 路线名称
     */
    private String lineName;
    /**
     * 区域ID
     */
    private Integer areaId;
    /**
     * 区域名称
     */
    private String areaName;
    /**
     * 仓库ID
     */
    private Integer warehouseId;
    /**
     * 仓库名称
     */
    private String warehouseName;
    /**
     * 配送员ID
     */
    private Integer distributionClerkId;
    /**
     * 状态(正常：normal 冻结：frozen 删除：delete)
     */
    private String status;
    /**
     * 创建用户ID
     */
    private Long createUserId;
    /**
     * 创建用户名称
     */
    private String createUserName;
    /**
     * 最后修改删除用户ID
     */
    private Long modifyUserId;
    /**
     * 最后修改删除用户名
     */
    private String modifyUserName;
    /**
     * 创建时间
     */
    private Date tmCreate;
    /**
     * 最新修改删除时间
     */
    private Date tmSmp;
}
