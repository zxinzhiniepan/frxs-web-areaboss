package com.frxs.web.areaboss.utils;

import io.swagger.models.auth.In;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 集合工具类
 * @author wushuo
 * @version $Id: CollectionUtils.java,v 0.1 2018年02月11日 10:39 $Exp
 */
public class CollectionUtils {

    /**
     * List<String> 转List<Integer>
     * @param strList
     * @return List<Integer>
     */
    public static List<Integer> strListToIntList(List<String> strList){
        List<Integer> result = new ArrayList<>();
        for (String str : strList) {
            result.add(Integer.valueOf(str));
        }
        return result;
    }

    /**
     * string 转 list<Integer>
     *   target="id=1&id=2&id=3..."
     * @param target
     * @return
     */
    public static List<Integer> strToIntList(String target){
        List<Integer> result = new ArrayList<>();
        String[] strings = target.split("&");
        for(int i=0;i<strings.length;i++){
            Integer id = Integer.valueOf(strings[i].split("=")[1]);
            result.add(id);
        }
        return result;
    }

    /**
     * string 转 list<Long>
     *   target="id=1&id=2&id=3..."
     * @param target
     * @return
     */
    public static List<Long> strToLongList(String target){
        List<Long> result = new ArrayList<>();
        String[] strings = target.split("&");
        for(int i=0;i<strings.length;i++){
            Long id = Long.valueOf(strings[i].split("=")[1]);
            result.add(id);
        }
        return result;
    }

    /**
     * * string 转 list<Long>
     *   target="1,2,3..."
     * @param target
     * @return
     */
    public static List<Integer> stringToIntList(String target){
        List<Integer> result = new ArrayList<>();
        String[] strings = target.split(",");
        for (String string : strings) {
            Integer id = Integer.valueOf(string);
            result.add(id);
        }
        return result;
    }

    /**
     * 数组去重
     * @param target
     * @return
     */
    public static String[] duplicate (String[] target) {
        Set<String> set = new HashSet<>();
        for (String s : target) {
            set.add(s);
        }
        String[] result = set.toArray(new String[set.size()]);
        return result;
    }

}
