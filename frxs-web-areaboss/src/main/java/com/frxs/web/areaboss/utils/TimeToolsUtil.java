package com.frxs.web.areaboss.utils;

import com.frxs.framework.util.common.StringUtil;
import com.frxs.framework.util.common.log4j.LogUtil;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author wushuo
 * @version $Id: TimeToolsUtil.java,v 0.1 2018年03月22日 14:42 $Exp
 */
public class TimeToolsUtil {
    /**
     * 根据用户传入的时间表示格式，返回当前时间的格式 如果是yyyyMMdd，注意字母y不能大写。
     *
     *             yyyyMMddhhmmss
     * @return
     */
    public static String getUserDate() {
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateString = formatter.format(currentTime);
        return dateString;
    }

    /**
     * @param endDate 时间， pattern
     * 将传入结束时间 无时分秒的 加 23:59:59
     * @return yyyy-MM-dd
     */
    public static String setEndDate(String endDate , String pattern){
        if(StringUtil.isBlank(endDate)){
            return endDate;
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd 23:59:59");
        try {
            Date date = simpleDateFormat.parse(endDate);
            return sf.format(date);
        } catch (ParseException e) {
            LogUtil.error("Can not parse the dateStr {}",endDate);
            LogUtil.error(e.getMessage());
            return endDate;
        }
    }

    public static  Date parseDateStr(String dateStr , String pattern){
        SimpleDateFormat sdf   = new SimpleDateFormat(pattern);
        Date date  = null;
        try {
            date = sdf.parse(dateStr);
        } catch (ParseException e) {
            LogUtil.error("Can not parse the dateStr {} by pattern {}",dateStr , pattern);
            LogUtil.error(e.getMessage());
        }
        return  date;
    }

    public static void main(String[] args) {
        System.out.println(TimeToolsUtil.setEndDate("2013-06-06","yyyy-MM-dd"));
    }
}
