package com.frxs.web.areaboss.dto;

import com.wuwenze.poi.annotation.ExportConfig;
import lombok.Data;

/**
 * @author wushuo
 * @version $Id: ExcelTemplateDto.java,v 0.1 2018年03月09日 19:09 $Exp
 */

@Data
public class StoreExcelTemplateDto {
    @ExportConfig(value = "序号")
    private String storeId;

    @ExportConfig(value = "区域ID")
    private String areaId;

    @ExportConfig(value = "区域")
    private String areaName;

    @ExportConfig(value = "门店编号")
    private String storeCode;

    @ExportConfig(value = "门店名称")
    private String storeName;

    @ExportConfig(value = "联系人")
    private String contacts;

    @ExportConfig(value = "门店账号")
    private String userName;

    @ExportConfig(value = "联系电话")
    private String contactsTel;

    @ExportConfig(value = "营业执照")
    private String busiLicenseFullName;

    @ExportConfig(value = "营业面积")
    private String shopArea;

    @ExportConfig(value = "食品流通许可证")
    private String foodCirculationLicense;

    @ExportConfig(value = "省ID")
    private Integer provinceId;

    @ExportConfig(value = "省")
    private String province;

    @ExportConfig(value = "市ID")
    private Integer cityId;

    @ExportConfig(value = "市")
    private String city;

    @ExportConfig(value = "区ID")
    private Integer countyId;

    @ExportConfig(value = "区/县")
    private String county;

    @ExportConfig(value = "门店地址")
    private String detailAddress;

    @ExportConfig(value = "门店微信群名称")
    private String wechatGroupName;

    @ExportConfig(value = "门店开发人员")
    private String storeDeveloper;

    @ExportConfig(value = "开户行")
    private String bankName;

    @ExportConfig(value = "账户名")
    private String bankAccountName;

    @ExportConfig(value = "银行账号")
    private String bankAccountNo;

    @ExportConfig(value = "银行行号")
    private String bankNo;

    @ExportConfig(value = "企业用户号")
    private String unionPayCID;

    @ExportConfig(value = "银联商户号")
    private String unionPayMID;
}
