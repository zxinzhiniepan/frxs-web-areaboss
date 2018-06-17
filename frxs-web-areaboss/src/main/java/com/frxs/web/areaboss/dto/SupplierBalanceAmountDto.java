/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.dto;

import lombok.Data;

import java.io.Serializable;

/**
 *  PRODUCT API  DTO
 *
 * @author liudiwei
 * @version $Id: productDto.java,v 0.1 2018年01月02日 下午 19:51 $Exp
 */
@Data
public class SupplierBalanceAmountDto implements Serializable{


    private static final long serialVersionUID = -2020573757414310283L;
    /**
     *  serialVersionUID
     */


    private Integer storeNo;

    private String storeName;
    private double sumAmount;
    private double auditingAmount;
    private double canAmount;
    private String bankAccountName;
    private String bankNO;
    private String bankName;
    private String bankAccountNO;

}
