/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.enums;

import com.frxs.framework.common.enums.BaseEnum;

import java.io.Serializable;

/**
 *  TradeBizTypeEnum
 *
 * @author mingbo.tang
 * @version $Id: TradeBizTypeEnum.java,v 0.1 2018年01月05日 下午 16:59 $Exp
 */
public enum TradeBizTypeEnum  implements BaseEnum<String> {
    /**
     *  NORMAL_ORDER
     */
    NORMAL_ORDER("001","普通订单")

    ;

    /**
     *  枚举值
     */
    private String value;
    /**
     *  枚举描述
     */
    private String desc;

    TradeBizTypeEnum(final String value, final String desc) {
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

    @Override
    public String getDesc() {
        return this.desc;
    }

    /**
     * 通过枚举<code>value</code>获得枚举
     *
     * @param value value
     * @return TradeBizTypeEnum
     */
    public static TradeBizTypeEnum getByValue(String value) {
        for (TradeBizTypeEnum tradeBizTypeEnum : values()) {
            if (tradeBizTypeEnum.getValue().equals(value)) {
                return tradeBizTypeEnum;
            }
        }
        return null;
    }
}
