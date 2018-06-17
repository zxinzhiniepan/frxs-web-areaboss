package com.frxs.web.areaboss.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author jiangboxuan
 * @version @version $Id: ParameterSetting.java,v 0.1 2018年01月31日 下午 14:43 $Exp
 */
@Data
public class ParameterSettingDto implements Serializable {
    /**
     * 系统参数id
     */
    private Integer id;
    /**
     * 参数编码
     */
    private String paraCode;
    /**
     * 参数名称
     */
    private String paraName;
    /**
     * 参数值
     */
    private String paraValue;
    /**
     * 备注
     */
    private String paraDescription;
    /**
     * 排序
     */
    private Integer sort;
    /**
     * 创建用户ID
     */
    private Long createUserId;
    /**
     * 创建用户名称
     */
    private String createUserName;
    /**
     * 最新修改删除ID
     */
    private Long modifyUserId;
    /**
     * 最新修改删除用户名称
     */
    private String modifyUserName;
    /**
     * 操作区域ID
     */
    private Integer areaId;
    /**
     * 创建时间
     */
    private Date tmCreate;
    /**
     * 最新修改删除时间
     */
    private Date tmSmp;
}
