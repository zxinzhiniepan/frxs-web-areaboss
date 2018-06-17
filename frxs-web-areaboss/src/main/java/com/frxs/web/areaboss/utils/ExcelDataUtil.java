package com.frxs.web.areaboss.utils;

import lombok.Data;

import javax.annotation.PostConstruct;
import java.io.Serializable;


/**
 * @author Colby.jianghao
 * @version $Id: CalculateAccess.java,v 0.1 2018年03月29日 18:12 $Exp
 */
@Data
public class ExcelDataUtil implements Serializable {
    private static final long serialVersionUID = 6012818404329289490L;
    //声明一个该工具类的静态的内部对象
    private static ExcelDataUtil excelDataUtil;

    //工具类中需要注入service，dao等需要
    //使用注解@PostConstruct把需要使用的service，dao等加载到上面定义的静态内部对象中
    @PostConstruct
    public void init() {
        excelDataUtil = this;
    }


    private String value;//单元格的值
    private int colSpan ;//单元格跨几列
    private int rowSpan ;//单元格跨几行
    private final boolean alignCenter = true;//单元格是否居中，默认不居中，如果选择是，则水平和上下都居中

    public ExcelDataUtil(int colSpan,int rowSpan,String value){
        this.colSpan = colSpan;
        this.rowSpan = rowSpan;
        this.value = value;
    }

}

