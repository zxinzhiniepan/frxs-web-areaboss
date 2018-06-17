/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.enums;

import com.frxs.framework.common.errorcode.constant.ErrorLevels;
import lombok.Getter;

/**
 * demo错误明细码枚举
 *
 * <p>code对应于标准错误码10~12位。而errorLevel对应于标准错误码的第4位 <p>在标准错误码的位置如下： <table border="1"> <tr>
 * <td>位置</td><td>1</td><td>2</td><td>3</td><td bgcolor="yellow">4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td
 * bgcolor="red">10</td><td bgcolor="red">11</td><td bgcolor="red">12</td> </tr> <tr>
 * <td>示例</td><td>F</td><td>E</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>2</td><td>7</td>
 * </tr> <tr> <td>说明</td><td colspan=2>固定<br>标识</td><td>规<br>范<br>版<br>本</td><td>错<br>误<br>级<br>别</td><td>错<br>误<br>类<br>型</td><td
 * colspan=4>错误场景</td><td colspan=3>错误编<br>码</td> </tr> </table>
 *
 * <p>错误明细码的CODE取值空间如下： <ul> <li>公共类错误码[000-099,999] </ul>
 *
 * @author mingbo.tang
 * @version $Id: DemoErrorCodeDetailEnum.java,v 0.1 2017年12月27日 上午 11:14 $Exp
 */
@Getter
public enum DemoErrorCodeDetailEnum {

    //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
    //                      公共类错误码[000-099,999]                           //
    //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//

    UNKNOWN_EXCEPTION("999", ErrorLevels.ERROR, "其它未知异常"),
    CONFIGURATION_ERROR("000", ErrorLevels.FATAL, "配置错误"),

    //========================================================================//
    //                              请求校验                                                                                            //
    //========================================================================//

    REQUEST_PARAM_ILLEGAL("001", ErrorLevels.WARN, "请求参数非法"),

    //========================================================================//
    //                              Business                                                                                            //
    //========================================================================//

    TRANSACTION_DEMO_ERROR("011", ErrorLevels.ERROR, "事务测试demo错误"),;

    /**
     * 枚举编码
     */
    private final String code;

    /**
     * 错误级别
     */
    private final String errorLevel;

    /**
     * 描述说明
     */
    private final String desc;

    /**
     * 私有构造函数。
     *
     * @param code 枚举编码
     * @param errorLevel 错误级别
     * @param desc 描述说明
     */
     DemoErrorCodeDetailEnum(String code, String errorLevel, String desc) {
        this.code = code;
        this.errorLevel = errorLevel;
        this.desc = desc;
    }

    /**
     * 通过枚举<code>code</code>获得枚举
     *
     * @param code 枚举编码
     * @return 支付错误明细枚举
     */
    public static DemoErrorCodeDetailEnum getByCode(String code) {
        for (DemoErrorCodeDetailEnum detailCode : values()) {
            if (detailCode.getCode().equals(code)) {
                return detailCode;
            }
        }
        return null;
    }
}
