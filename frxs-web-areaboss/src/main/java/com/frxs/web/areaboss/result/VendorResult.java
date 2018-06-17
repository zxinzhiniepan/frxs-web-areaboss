package com.frxs.web.areaboss.result;

import com.frxs.framework.web.domain.BaseWebResult;
import lombok.Data;

/**
 * web统一返回结果
 *
 * @author sh
 * @version $Id: VendorResult.java,v 0.1 2018年01月29日 下午 20:17 $Exp
 */
@Data
public class VendorResult<T> extends BaseWebResult {

    /**
     * 返回结果
     */
    private T record;
}
