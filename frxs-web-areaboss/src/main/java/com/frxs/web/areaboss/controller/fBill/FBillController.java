package com.frxs.web.areaboss.controller.fBill;


import com.alibaba.dubbo.config.annotation.Reference;
import com.frxs.framework.util.common.log4j.FileLogUtil;
import com.frxs.framework.util.common.log4j.LogUtil;
import com.frxs.fund.service.api.domain.dto.remit.RemitDetailDto;
import com.frxs.fund.service.api.domain.request.export.ExcelExportRequest;
import com.frxs.fund.service.api.domain.request.remit.RemitDetailRequest;
import com.frxs.fund.service.api.domain.result.export.ExcelExportResult;
import com.frxs.fund.service.api.domain.result.remit.RemitDetailResult;
import com.frxs.fund.service.api.facade.export.ExcelExportFacade;
import com.frxs.fund.service.api.facade.remit.RemitDetailFacade;
import com.frxs.sso.sso.SessionUser;
import com.frxs.sso.sso.SessionUtils;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.Constants;
import com.google.common.base.Stopwatch;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author wang.zhen
 * @version $Id: TradeController.java,v 0.1 2018年02月07日 18:41 $Exp
 */
@Controller
public class FBillController {

    @Reference(check = false,version = "1.0.0",timeout = 120000)
    private RemitDetailFacade remitDetailFacade;
    @Reference(check = false, version = "1.0.0",timeout = 3000000)
    ExcelExportFacade excelExportFacade;

    /**
     * 分账单明细列表
     * @param request
     * @return
     */
    @RequestMapping(value="/fBill/getFBillList")
    @ResponseBody
    public Map getFBillDetailList(ModelMap map,RemitDetailRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        try{
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            RemitDetailResult result= remitDetailFacade.queryRemitDetailPage(request);
            resultMap.put("rows",result.getSetRemitDetailDtos());
            resultMap.put("total",result.getTotal());
            RemitDetailResult<RemitDetailDto> result1=remitDetailFacade.sumRemit(request);
            List<RemitDetailDto> list2=new ArrayList<>();
            if(result1!=null && result1.getData()!=null){
                list2.add(result1.getData());
            }
            resultMap.put("footer",list2);
        }catch (Exception e){
            LogUtil.error("/fBill/getFBillList error={}",e.getMessage());
            e.printStackTrace();
        }
        return resultMap;
    }


    /**
     * 导出分账单明细
     * @param request
     * @return
     */
    @RequestMapping(value="/fBill/downloadFBillData")
    @ResponseBody
    public List<RemitDetailDto> downloadFBillData(RemitDetailRequest request,HttpServletRequest request2){
        Map resultMap = new HashMap();
        List<RemitDetailDto> list=null;
        try{
            request.setPage(1);
            request.setRows(Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            RemitDetailResult result= remitDetailFacade.queryRemitDetailPage(request);
            list=result.getSetRemitDetailDtos();
            RemitDetailResult<RemitDetailDto> result1=remitDetailFacade.sumRemit(request);
            if(result1!=null && result1.getData()!=null){
                list.add(result1.getData());
            }
        }catch (Exception e){
            e.printStackTrace();
            LogUtil.error("/fBill/downloadFBillData error={}",e.getMessage());
        }
        return list;
    }

    @RequestMapping(value = "/fBill/createExcel")
    @ResponseBody
    public WebResult createExcel(RemitDetailRequest request,HttpServletRequest request2){
        WebResult webResult = new WebResult();
        String[] titleNameArray = {
            "分帐日期",
            "分帐单号",
            "划付编号",
            "分帐类型",
            "付款方企业用户号",
            "付款方编号",
            "付款方名称",
            "划付金额",
            "回盘金额",
            "来源单据号",
            "收款方编号",
            "收款方名称",
            "帐户名",
            "开户行",
            "帐号",
            "附言",
            "银行行号",
            "分帐状态",
            "分帐状态说明",
            "银行内部ID"
        };
        Date now=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String fileName= "区域分账单_"+simpleDateFormat.format(now);
        String sheetName= fileName;
        fileName= uuid+"@@"+"区域分账单_"+simpleDateFormat.format(now);
        String[] arrField = {
            "remitDate",
            "fundRemitNo",
            "fundRemitDetailId",
            "remitTypeDesc",
            "unionPayCID",
            "payerCode",
            "payerName",
            "remitAmt",
            "remittedAmt",
            "originBizNo",
            "payeeCode",
            "payeeName",
            "bankPayeeName",
            "bankName",
            "bankAccount",
            "remark",
            "bankNo",
            "remitStatusDesc",
            "remitRetRemark",
            "remitOutBizNo"
        };

        ExcelExportResult excelExportResult = new ExcelExportResult();
        ExcelExportRequest excelExportRequest = new ExcelExportRequest();
        try {
            request.setFooterFlag(Constants.SHOWFOOTER_ZERO);
            request.setPage(1);
            request.setRows(Integer.MAX_VALUE);
            SessionUser sessionUser = SessionUtils.getSessionUser(request2);
            request.setAreaId(sessionUser.getRegionId());
            excelExportRequest.setObj(request);
            excelExportRequest.setArrName(titleNameArray);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
            excelExportRequest.setTitle(null);
            excelExportResult = excelExportFacade.createExcelPath(excelExportRequest);
            if(excelExportResult.isSuccess()){
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRecord(excelExportResult.getRspInfo());
            }else{
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc(excelExportResult.getRspInfo());
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
        }
        return webResult;
    }

    @RequestMapping(value = "/fBill/exportExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public void exportExcel(String fileName,HttpServletResponse response) {
        File file = new File(fileName);
        try {
            Stopwatch readStopwatch2 = Stopwatch.createStarted();
            BufferedInputStream fis = new BufferedInputStream(new FileInputStream(file.getPath()));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            response.reset();
            ServletOutputStream out = response.getOutputStream();
            OutputStream toClient = new BufferedOutputStream(out);
            response.setContentType("application/octet-stream");
            String fName= null;
            if(fileName.contains(File.separator)){
                fName=fileName.substring(fileName.lastIndexOf(File.separator )+1);
            }
            fName=fName.split("@@")[1];
            response.setHeader("Content-Disposition", "attachment;filename=" +
                new String(fName.getBytes("UTF-8"),"ISO-8859-1"));
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
            out.close();
            file.delete();
            readStopwatch2.stop();
            FileLogUtil
                .info("exportExcel", "导出EXCEL文件fileName={}读取EXCEL文件耗时time={}", fName, readStopwatch2);
        } catch (Exception ex) {
            LogUtil.error("excel下载失败{}",ex.getMessage());
        } finally {
            if (file.exists()) {
                file.delete();
            }
        }
    }

}
