/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.enums;

import com.frxs.framework.common.enums.BaseEnum;
import java.io.Serializable;

/**
 * 文件目录
 *
 * @author sh
 * @version $Id: FileDirEnum.java,v 0.1 2018年03月01日 下午 15:54 $Exp
 */
public enum FileDirEnum implements BaseEnum<String> {
    ONLINE_IMG("onlineImg", "图文直播图片目录"),
    VENDOR_PRODUCT_IMG("vendorProductImg", "供应商图片目录"),
    PRODUCT_AD_IMG("productAdImg", "商品广告图"),
    PRODUCT_MAIN_IMG("productMainImg", "商品主图"),;

    private String value;
    private String desc;

    FileDirEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    @Override
    public String getValueDefined() {
        return this.value;
    }

    @Override
    public String getDesc() {
        return this.desc;
    }

    @Override
    public Serializable getValue() {
        return this.value;
    }
}
