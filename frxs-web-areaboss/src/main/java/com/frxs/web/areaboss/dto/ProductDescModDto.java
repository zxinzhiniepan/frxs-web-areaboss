/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.dto;

import com.frxs.merchant.service.api.dto.AbstractSuperDto;
import lombok.Data;

/**
 * table name:  t_product_desc
 * author name: sh
 * create time: 2018-01-25 19:50:51
 */
@Data
public class ProductDescModDto extends AbstractSuperDto {

  /**
   * 商品信息id
   */
  private Long productInfoId;
  /**
   * 商品id
   */
  private Long productId;
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
   * 图片
   */
  private String detailPicArr;
}
