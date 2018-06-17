/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

package com.frxs.web.areaboss.dto;

import java.io.Serializable;
import lombok.Data;

/**
 * 图片上传返回结果DTO
 *
 * @author sh
 * @version $Id: UploadImgDto.java,v 0.1 2018年02月27日 下午 18:19 $Exp
 */
@Data
public class UploadImgDto implements Serializable {

    private static final long serialVersionUID = -7422493448093982661L;

    /**
     * 上传状态 succes  failed
     */
    private String status;

    /**
     * 回传消息
     */
    private String msg;
    /**
     * 原图地址
     */
    private String originalImgUrl;
    /**
     * 60*60图片地址
     */
    private String imgUrl60;
    /**
     * 120*120图片地址
     */
    private String imgUrl120;
    /**
     * 200*200图片地址
     */
    private String imgUrl200;
    /**
     * 400*400图片地址
     */
    private String imgUrl400;
}
