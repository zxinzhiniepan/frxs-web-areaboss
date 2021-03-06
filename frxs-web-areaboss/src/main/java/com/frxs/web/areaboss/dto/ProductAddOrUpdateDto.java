/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.dto;

import com.frxs.merchant.service.api.dto.AbstractSuperDto;
import com.frxs.merchant.service.api.dto.ProductAttrvalRelationDto;
import com.frxs.merchant.service.api.dto.ProductImgDto;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

/**
 * 商品sku
 * table name:  t_product
 * author name: sh
 * create time: 2018-01-25 19:50:51
 */
@Data
public class ProductAddOrUpdateDto extends AbstractSuperDto implements Serializable {


  private static final long serialVersionUID = -4580680723574868357L;
  /**
   * 商品id
   */
  private Long productId;
  /**
   * 商品信息id
   */
  private Long productInfoId;
  /**
   * 商品sku编码
   */
  private String sku;
  /**
   * 商品sku名称
   */
  private String productName;
  /**
   * 商品sku标题
   */
  private String productTitle;
  /**
   * 商品销售类型:HOT-爆款,NORMAL-常规
   */
  private String saleType;
  /**
   * 供应商id
   */
  private Long vendorId;
  /**
   * 供应商名称
   */
  private String vendorName;
  /**
   * 供应商简称
   */
  private String vendorShortName;
  /**
   * 供应商logo
   */
  private String vendorLogo;
  /**
   * 区域id
   */
  private Long areaId;
  /**
   * 库存
   */
  private BigDecimal stock;
  /**
   * 限量
   */
  private BigDecimal limitQty;
  /**
   * 剩余库存
   */
  private BigDecimal surplusStock;
  /**
   * 已售量
   */
  private BigDecimal saleQty;
  /**
   * 商品sku状态:UP-上架，DOWN-下架，DELETED-已删除
   */
  private String skuStatus;
  /**
   * 供货价
   */
  private BigDecimal supplyAmt;
  /**
   * 销售价
   */
  private BigDecimal saleAmt;
  /**
   * 市场价
   */
  private BigDecimal marketAmt;
  /**
   * 每份平台服务费
   */
  private BigDecimal perServiceAmt;
  /**
   * 每份提成
   */
  private BigDecimal perCommission;
  /**
   * 生产地
   */
  private String yieldly;
  /**
   * 商品规格类型:SINGLE-单规格(单规格即从该商品系列中移除,可独立售卖),MULTI-多规格
   */
  private String specType;
  /**
   * 包装数
   */
  private BigDecimal packageQty;
  /**
   * 售后时限
   */
  private BigDecimal saleLimitTime;
  /**
   * 售后时限单位：DAY-天，HOUR-时
   */
  private String saleLimitTimeUnit;
  /**
   * 条形码列表,以","分隔
   */
  private String barCodes;
  /**
   * 品牌名称
   */
  private String brandName;
  /**
   * 商品分享副标题
   */
  private String shareTitle;
  /**
   * 商品简介
   */
  private String briefDesc;
  /**
   * 商品详情
   */
  private String detailDesc;
  /**
   * 商品属性
   */
  private List<ProductAttrvalRelationDto> attrs;
  /**
   * 商品主图
   */
  private List<ProductImgDto> primaryUrls;
  /**
   * 广告图
   */
  private ProductImgDto adImgUrl;
  /**
   * 详情图片
   */
  private List<ProductImgDto> detailUrls;
    /**
     * 商品广告图
     */
    private String advertisementImageSrc;
    /**
     * 商品图片传输
     */
    private String detailUrlsArr;
    /**
     * 商品规格
     */
    private String attrVal;
}
