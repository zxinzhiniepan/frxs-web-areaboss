package com.frxs.web.areaboss.utils;

import org.springframework.beans.BeanUtils;
import java.util.List;

/**
 * 工具类，用于拷贝类型之间的属性
 * <p>
 * 应注意以下问题：
 * 1.copyProperties的源对象Integer，Long等类型的属性为null时，目标对象的对应属性为0。
 * 2.copyProperties的两个参数对象类型为String、Integer等时，目标对象没有改变。
 * </p>
 * Created by liudiwei on 2016/3/17.
 * Last update：2016/3/23
 */
public class BeanConvertUtils {
    /**
     * 拷贝两个对象中<b>同名同类型</b>的属性
     * <p>对象类型必须是public access</p>
     *
     * @param source 源对象
     * @param target 目标对象
     */
    public static void copyProperties(Object source, Object target) {
        BeanUtils.copyProperties(source, target);
    }

    /**
     * 对源列表中的元素进行拷贝（<b>同名同类型</b>的属性），并将拷贝对象填入目标列表中
     * <p>元素类型必须具备无参数构造器</p>
     * <p>元素类型必须是public access</p>
     *
     * @param source          源列表
     * @param target          目标列表
     * @param targetItemClass 目标列表中的元素类的Class，用于生成实例
     * @param <T>             目标列表中元素的类型
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    public static <T> void copyProperties(List<?> source, List<T> target, Class<T> targetItemClass) throws InstantiationException, IllegalAccessException {
        for (Object sourceItem : source) {
            target.add(generateCopiedObject(sourceItem, targetItemClass));
        }
    }

    /**
     * 生成一个拷贝了源对象同名同类型属性的目标类的实例
     * <P>目标类型必须具有无参数构造器</P>
     * <p>对象类型必须是public access</p>
     *
     * @param source
     * @param targetClass
     * @param <T>
     * @return
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    private static <T> T generateCopiedObject(Object source, Class<T> targetClass) throws IllegalAccessException, InstantiationException {
        T target = targetClass.newInstance();
        copyProperties(source, target);
        return target;
    }
}
