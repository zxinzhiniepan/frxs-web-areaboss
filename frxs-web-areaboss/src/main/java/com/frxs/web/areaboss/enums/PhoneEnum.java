/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2017. All Rights Reserved.
 */

package com.frxs.web.areaboss.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.frxs.framework.common.enums.BaseEnum;

import java.io.Serializable;

/**
 *   PhoneEnum
 *
 * @author mingbo.tang
 * @version $Id: AgeEnum.java,v 0.1 2017年12月29日 下午 16:43 $Exp
 */
public enum PhoneEnum implements BaseEnum<String> {
    /**
     *  中国移动
     */
    CMCC("10086", "中国移动"),
    /**
     *  中国联通
     */
    CUCC("10010", "中国联通"),
    /**
     *  中国电信
     */
    CT("10000", "中国电信");

    /**
     *  枚举值
     */
    private String value;
    /**
     *  枚举描述
     */
    private String desc;

    PhoneEnum(final String value, final String desc) {
        this.value = value;
        this.desc = desc;
    }

    @Override
    public Serializable getValue() {
        return this.value;
    }

    @Override
    public String getValueDefined() {
        return this.value;
    }

    @JsonValue
    @Override
    public String getDesc(){
        return this.desc;
    }

    /**
     * 通过枚举<code>value</code>获得枚举
     *
     * @param value value
     * @return AgeEnum
     */
    public static PhoneEnum getByValue(String value) {
        for (PhoneEnum phoneEnum : values()) {
            if (phoneEnum.getValue().equals(value)) {
                return phoneEnum;
            }
        }
        return null;
    }
}
