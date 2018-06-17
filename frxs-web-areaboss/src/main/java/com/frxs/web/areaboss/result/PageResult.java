package com.frxs.web.areaboss.result;

import lombok.Data;

/**
 * @author fygu
 * @version $Id: PageResult.java,v 0.1 2018年01月18日 9:41 $Exp
 */
@Data
public class PageResult
{
    /**
     * 结果体
     */
    protected Object data;

    /**
     * 状态码
     */
    protected Integer code;

    protected String  flag;

    /**
     * 信息
     */
    protected String info;

}
