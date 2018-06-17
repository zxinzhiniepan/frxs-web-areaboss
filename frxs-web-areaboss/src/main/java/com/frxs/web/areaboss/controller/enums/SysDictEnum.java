package com.frxs.web.areaboss.controller.enums;

/**
 * 系统字典枚举
 * @author luozujun
 */
public enum  SysDictEnum {
    REFUND_TYPE("REFUND_TYPE", "售后类型"),

    FINE_TYPE("FINE_TYPE", "售后类型");

    SysDictEnum(String dictCode, String dictName) {
        this.dictCode = dictCode;
        this.dictName = dictName;
    }

    public String getDictCode() {

        return dictCode;
    }

    public String getDictName() {
        return dictName;
    }

    /**
     * 字典编码
     */

    private String dictCode;

    /**
     * 字典名称
     */
    private String dictName;
}

