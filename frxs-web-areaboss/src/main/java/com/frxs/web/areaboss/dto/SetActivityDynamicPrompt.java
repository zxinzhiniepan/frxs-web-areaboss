package com.frxs.web.areaboss.dto;


import java.io.Serializable;
import java.util.Date;

public class SetActivityDynamicPrompt  {
    /*
   主键
    */
    private Integer dynamicPromptId;

    /*
   名称
    */
    private String dynamicPromptName;

    /*
   提示内容
    */
    private String Content;

    /*
     展示开始时间
      */
    private Date displayStartTime;

    /*
     展示结束时间
      */
    private Date displayEndTime;

    /*
        状态
         */
    private String status;
    /*
    描述
     */
    private String reminder;
    /*
   区域Id
    */
    private String opAreaId;

    public String getReminder() {
        return reminder;
    }

    public void setReminder(String reminder) {
        this.reminder = reminder;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }

    public Integer getDynamicPromptId() {
        return dynamicPromptId;
    }

    public void setDynamicPromptId(Integer dynamicPromptId) {
        this.dynamicPromptId = dynamicPromptId;
    }

    public String getDynamicPromptName() {
        return dynamicPromptName;
    }

    public void setDynamicPromptName(String dynamicPromptName) {
        this.dynamicPromptName = dynamicPromptName;
    }

    public Date getDisplayStartTime() {
        return displayStartTime;
    }

    public void setDisplayStartTime(Date displayStartTime) {
        this.displayStartTime = displayStartTime;
    }

    public Date getDisplayEndTime() {
        return displayEndTime;
    }

    public void setDisplayEndTime(Date displayEndTime) {
        this.displayEndTime = displayEndTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOpAreaId() {
        return opAreaId;
    }

    public void setOpAreaId(String opAreaId) {
        this.opAreaId = opAreaId;
    }
}
