package com.frxs.web.areaboss.enums;

import com.frxs.framework.common.enums.BaseEnum;
import java.io.Serializable;

/**
 * 通用状态值
 * @author wushuo
 * @version $Id: StatusEnum.java,v 0.1 2018年02月22日 11:21 $Exp
 */
public enum StatusEnum implements BaseEnum<String>{
    AUDITING("AUDITING","审核"),
    NORMAL("NORMAL","正常"),
    FROZEN("FROZEN","冻结"),
    DELETE("DELETE","删除"),
    ;


    private String value;

    private String desc;

    StatusEnum(String value, String desc) {
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
     * @return StatusEnum
     */
    public static StatusEnum getByValue(String value) {
        for (StatusEnum statusEnum : values()) {
            if (statusEnum.getValue().equals(value)) {
                return statusEnum;
            }
        }
        return null;
    }
}
