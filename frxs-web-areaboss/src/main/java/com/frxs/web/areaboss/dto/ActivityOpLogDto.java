package com.frxs.web.areaboss.dto;

import com.frxs.promotion.service.api.dto.AbstractSuperDto;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import lombok.Data;

/**
 * 活动
 *
 * @author sh
 * @version $Id: ActivityDto.java,v 0.1 2018年01月24日 下午 19:08 $Exp
 */
@Data
public class ActivityOpLogDto implements Serializable {

  private static final long serialVersionUID = -3413573859109269144L;
  private Long activityId;
  /**
   * 区域id
   */
  private Long areaId;
  /**
   * 活动类型：NORMAL-正常预售，SECKILL-秒杀
   */
  private String activityType;
  /**
   * 购买开始时间
   */
  private String tmBuyStart;
  /**
   * 购买结束时间
   */
  private String tmBuyEnd;
  /**
   * 显示开始时间
   */
  private String tmDisplayStart;
  /**
   * 显示结束时间
   */
  private String tmDisplayEnd;
  /**
   * 提货时间
   */
  private String tmPickUp;
  /**
   * 活动状态：PENDING-待审核，PASS-审核通过，REJECT-驳回,DELETED-已删除
   */
  private String status;
  /**
   * 预售活动商品列表
   */
  private List<PreproductOpLogDto> preproductList;


}
