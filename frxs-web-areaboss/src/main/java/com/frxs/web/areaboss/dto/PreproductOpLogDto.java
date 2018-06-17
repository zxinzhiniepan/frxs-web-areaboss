package com.frxs.web.areaboss.dto;

import com.alibaba.fastjson.annotation.JSONField;
import com.frxs.promotion.service.api.dto.AbstractSuperDto;
import com.frxs.promotion.service.api.dto.OnlineImgtextDto;
import com.frxs.promotion.service.api.dto.PreproductAttrValDto;
import com.frxs.promotion.service.api.dto.PreproductImgDto;
import com.frxs.promotion.service.api.dto.consumer.ConsumerDto;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import lombok.Data;

/**
 * 预售商品详情
 */
@Data
public class PreproductOpLogDto implements Serializable {

  private static final long serialVersionUID = -7416445550939124443L;
  /**
   * 商品id
   */
  private Long productId;
  /**
   * 商品sku
   */
  private String sku;
  /**
   * 活动id
   */
  private Long activityId;
  /**
   * 供应商id
   */
  private Long vendorId;
  /**
   * 是否直采：TRUE-直采,FALSE-非直采
   */
  private String directMining;
  /**
   * 规格属性:key=属性名称，value=属性值
   */
  private List<PreproductAttrValDto> attrs;
  /**
   * 售价（元）
   */
  private BigDecimal saleAmt;
  /**
   * 市场价（元）
   */
  private BigDecimal marketAmt;
  /**
   * 供货价
   */
  private BigDecimal supplyAmt;
  /**
   * 已售份数
   */
  private BigDecimal saleQty;
  /**
   * 限量
   */
  private BigDecimal limitQty;
  /**
   * 用户限量
   */
  private BigDecimal userLimitQty;
  /**
   * 平台服务费
   */
  private BigDecimal perServiceAmt;
  /**
   * 每份提成
   */
  private BigDecimal perCommission;
  /**
   * 包装数
   */
  private BigDecimal packageQty;
  /**
   * 售后时限
   */
  private BigDecimal saleLimitTime;
  /**
   * 售后时限单位:DAY-天，HOUR-时
   */
  private String saleLimitTimeUnit;
  /**
   * 商品规格类型:SINGLE-单规格,MULTI-多规格
   */
  private String specType;
  /**
   * 条形码列表JSON串
   */
  private String barCodes;
}