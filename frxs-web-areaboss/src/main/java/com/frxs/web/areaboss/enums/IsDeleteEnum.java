package com.frxs.web.areaboss.enums;

import com.frxs.framework.common.enums.BaseEnum;
import java.io.Serializable;

/**
 * 通用状态值
 * @author wushuo
 * @version $Id: IsDeleteEnum.java,v 0.1 2018年02月22日 11:26 $Exp
 */
public enum IsDeleteEnum implements BaseEnum<String>{
    IS_DELETE_N("N","未删除"),
    IS_DELETE_Y("Y","已删除"),
    ;

    private String value;

    private String desc;

    IsDeleteEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    @Override public String getValueDefined() {
        return this.value;
    }

    @Override public String getDesc() {
        return this.desc;
    }

    @Override public Serializable getValue() {
        return this.value;
    }

    /**
     * 通过枚举<code>value</code>获得枚举
     *
     * @param value value
     * @return IsDeleteEnum
     */
    public static IsDeleteEnum getByValue(String value) {
        for (IsDeleteEnum isDeleteEnum : values()) {
            if (isDeleteEnum.getValue().equals(value)) {
                return isDeleteEnum;
            }
        }
        return null;
    }
}
