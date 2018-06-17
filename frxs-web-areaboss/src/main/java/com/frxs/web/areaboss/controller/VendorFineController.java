package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.fund.service.api.domain.dto.penalty.VendorPenaltyBatchDto;
import com.frxs.fund.service.api.domain.dto.penalty.VendorPenaltyBatchRetDto;
import com.frxs.fund.service.api.domain.dto.penalty.VendorPenaltyDto;
import com.frxs.fund.service.api.domain.enums.VendorPenaltyEnum;
import com.frxs.fund.service.api.domain.request.export.ExcelExportRequest;
import com.frxs.fund.service.api.domain.request.penalty.VendorPenaltyBatchRequest;
import com.frxs.fund.service.api.domain.request.penalty.VendorPenaltyDetailRequest;
import com.frxs.fund.service.api.domain.request.penalty.VendorPenaltyQryRequest;
import com.frxs.fund.service.api.domain.request.withdraw.VendorWithdrawQryRequest;
import com.frxs.fund.service.api.domain.result.export.ExcelExportResult;
import com.frxs.fund.service.api.domain.result.penalty.VendorPenaltyBacthResult;
import com.frxs.fund.service.api.domain.result.penalty.VendorPenaltyDetailResult;
import com.frxs.fund.service.api.domain.result.penalty.VendorPenaltyQryResult;
import com.frxs.fund.service.api.domain.result.withdraw.VendorCanWithdrawResult;
import com.frxs.fund.service.api.facade.export.ExcelExportFacade;
import com.frxs.fund.service.api.facade.penalty.VendorPenaltyFacade;
import com.frxs.fund.service.api.facade.widthdraw.VendorWithdrawFacade;
import com.frxs.merchant.service.api.dto.SysDictDetailDto;
import com.frxs.merchant.service.api.dto.VendorDto;
import com.frxs.merchant.service.api.facade.SysDictDetailFacade;
import com.frxs.merchant.service.api.facade.VendorFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.promotion.service.api.dto.PreproductDto;
import com.frxs.promotion.service.api.dto.VendorPreproductQueryDto;
import com.frxs.promotion.service.api.facade.ActivityPreproductFacade;
import com.frxs.promotion.service.api.result.PromotionBaseResult;
import com.frxs.web.areaboss.controller.enums.SysDictEnum;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.Constants;
import com.frxs.web.areaboss.utils.TimeToolsUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 供应商罚款
 *
 * @author fygu
 * @version $Id: VendorFineController.java,v 0.1 2018年02月26日 13:44 $Exp
 */
@Controller
@RequestMapping("/vendorFine")
public class VendorFineController {

    //@Reference(check = false,url = "dubbo://192.168.8.108:28226")
    @Reference(check = false, version = "1.0.0",timeout = 30000)
    VendorPenaltyFacade vendorPenaltyFacade;

    //@Reference(check = false,url = "dubbo://192.168.8.108:28226")
    @Reference(check = false, version = "1.0.0",timeout = 30000)
    VendorWithdrawFacade vendorWithdrawFacade;

    //@Reference(check = false,version = "1.0.0",url = "dubbo://192.168.8.108:8216")
    @Reference(check = false, version = "1.0.0",timeout = 30000)
    VendorFacade vendorFacade;

    //@Reference(check = false,version = "1.0.0",url = "dubbo://192.168.8.108:8222")
    @Reference(check = false, version = "1.0.0",timeout = 30000)
    ActivityPreproductFacade activityPreproductFacade;

    @Reference(check = false, version = "1.0.0",timeout = 30000)
    SysDictDetailFacade sysDictDetailFacade;

    //@Reference(check = false, version = "1.0.0",timeout = 30000,url = "dubbo://192.168.8.108:28226")
    @Reference(check = false, version = "1.0.0",timeout = 60000)
    ExcelExportFacade excelExportFacade;

    @Autowired
    HttpServletRequest request;

    /**
     * 供应商罚款列表查询
     *
     * @param page 分页数
     * @param rows 分页大小
     * @return smsList
     */
    @RequestMapping(value = {"/getVendorFineList"})
    @ResponseBody
    public Map getVendorFineList(HttpServletRequest request, VendorPenaltyQryRequest vendorPenaltyQryRequest, int page, int rows) {
        //页面没有时分秒格式，结束时间加一天
        if (vendorPenaltyQryRequest.getPenaltyDateEnd() != null) {
            Calendar c = Calendar.getInstance();
            c.setTime(vendorPenaltyQryRequest.getPenaltyDateEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            vendorPenaltyQryRequest.setPenaltyDateEnd(c.getTime());
        }
        //VendorPenaltyQryRequest vendorPenaltyQryRequest =new VendorPenaltyQryRequest();
        Map resultMap = new HashMap();
        VendorPenaltyQryResult vendorPenaltyQryResult = null;
        try {
            vendorPenaltyQryRequest.setPage(page);
            vendorPenaltyQryRequest.setRows(rows);
            Integer regionId = UserLoginInfoUtil.getRegionId(request).intValue();
            vendorPenaltyQryRequest.setAreaId(regionId);
            vendorPenaltyQryRequest.setCheckRole(Constants.QYGL);
            vendorPenaltyQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);
            vendorPenaltyQryResult = vendorPenaltyFacade.selectPageVendorPenalty(vendorPenaltyQryRequest);
            resultMap.put("rows", vendorPenaltyQryResult.getRows());
            resultMap.put("footer", vendorPenaltyQryResult.getFooter());
            resultMap.put("total", vendorPenaltyQryResult.getTotal());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }


    @RequestMapping(value = "/createExcel",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public WebResult createExcel(VendorPenaltyQryRequest vendorPenaltyQryRequest,HttpServletResponse response){
        WebResult webResult = new WebResult();
        String fileName = "供应商罚金_"+ TimeToolsUtil.getUserDate();
        //String title = "兴盛电商-【兴盛优选】售后日报表";

        String sheetName= "供应商罚金";
        String[] arrName = {"单据日期", "单号", "状态", "区域名称",  "供应商编码", "供应商名称",
            "开户行", "供应商违约金", "总金额", "审核中的金额", "可提现金额", "罚款类型", "罚款原因", "创建人员",
            "创建时间", "审核人", "审核时间", "复核人", "复核时间"
        };

        String[] arrField = {"penaltyDate", "vendorPenaltyNo", "statusName", "areaName", "vendorCode",
            "vendorName", "bankName", "penaltyAmt", "totalAmt", "auditingAmt", "canWithdrawAmt",
            "penaltyTypeText", "penaltyReason", "createUserName", "tmCreate", "firstCheckerName", "tmFirstCheck",
            "auditUserName", "tmAudit"
        };

        if (vendorPenaltyQryRequest.getPenaltyDateEnd() != null) {
            Calendar c = Calendar.getInstance();
            c.setTime(vendorPenaltyQryRequest.getPenaltyDateEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            vendorPenaltyQryRequest.setPenaltyDateEnd(c.getTime());
        }

        ExcelExportResult excelExportResult = new ExcelExportResult();
        ExcelExportRequest excelExportRequest = new ExcelExportRequest();
        try {
            Integer regionId = UserLoginInfoUtil.getRegionId(request).intValue();
            vendorPenaltyQryRequest.setAreaId(regionId);
            vendorPenaltyQryRequest.setCheckRole(Constants.QYGL);
            vendorPenaltyQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);
            excelExportRequest.setObj(vendorPenaltyQryRequest);
            excelExportRequest.setArrName(arrName);
            excelExportRequest.setArrField(arrField);
            excelExportRequest.setSheetName(sheetName);
            excelExportRequest.setFileName(fileName);
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


    /**
     * 供应商罚款添加按钮跳转
     */
    @RequestMapping(value = "/addFine", method = RequestMethod.GET)
    public String selectaddFine(ModelMap map) {

        List<SysDictDetailDto> list = storeProdReturnType();
        Collections.sort(list, new Comparator<SysDictDetailDto>() {
            @Override
            public int compare(SysDictDetailDto h1, SysDictDetailDto h2) {
                Integer dic1 = Integer.parseInt(h1.getDictValue());
                Integer dic2 = Integer.parseInt(h2.getDictValue());
                return dic1.compareTo(dic2);
            }
        });
        map.addAttribute("list", list);
        return "vendorFine/addFine";
    }

    /**
     * 编辑供应商罚款
     */
    @RequestMapping(value = "/editFine", method = RequestMethod.GET)
    public String editFine(ModelMap map, String vendorPenaltyNo) {
        VendorPenaltyDetailResult vendorPenaltyDetailResult = null;
        try {
            vendorPenaltyDetailResult = vendorPenaltyFacade.findVendorPenaltyByPK(vendorPenaltyNo);
            List<SysDictDetailDto> list = storeProdReturnType();
            if (vendorPenaltyDetailResult != null) {
                Collections.sort(list, new Comparator<SysDictDetailDto>() {
                    @Override
                    public int compare(SysDictDetailDto h1, SysDictDetailDto h2) {
                        Integer dic1 = Integer.parseInt(h1.getDictValue());
                        Integer dic2 = Integer.parseInt(h2.getDictValue());
                        return dic1.compareTo(dic2);
                    }
                });
                map.addAttribute("list", list);
                map.addAttribute("dto", vendorPenaltyDetailResult.getFundVendorPenaltyDto());
                map.addAttribute("listDto", vendorPenaltyDetailResult.getListFundVendorPanaltyTrackDto());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "vendorFine/editFine";
    }

    /**
     * 供应商查看按钮跳转
     */
    @RequestMapping(value = {"/viewFine"}, method = RequestMethod.GET)
    public String selectviewFine(ModelMap map, String vendorPenaltyNo) {
        VendorPenaltyDetailResult vendorPenaltyDetailResult = null;
        try {
            vendorPenaltyDetailResult = vendorPenaltyFacade.findVendorPenaltyByPK(vendorPenaltyNo);
            if (vendorPenaltyDetailResult != null) {
                map.addAttribute("dto", vendorPenaltyDetailResult.getFundVendorPenaltyDto());
                map.addAttribute("listDto", vendorPenaltyDetailResult.getListFundVendorPanaltyTrackDto());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "vendorFine/viewFine";
    }

    /**
     * 供应商罚款添加  查询供应商活动商品
     */
    @RequestMapping(value = "/queryVendorPreproduct", method = RequestMethod.GET)
    public String queryVendorPreproduct(ModelMap map, long vendorId) {

        map.addAttribute("vendorId", vendorId);

        return "vendorFine/vendorPreproductList";
    }

    /**
     * 供应商罚款信息跟踪
     *
     * @param vendorPenaltyNo 供应商Id
     */
    @RequestMapping(value = "/getVendorFineTrackFineId", method = RequestMethod.POST)
    @ResponseBody
    public Map getVendorFineTrackFineId(String vendorPenaltyNo) {
        Map resultMap = new HashMap();
        VendorPenaltyDetailResult vendorPenaltyDetailResult = null;
        try {
            vendorPenaltyDetailResult = vendorPenaltyFacade.findVendorPenaltyByPK(vendorPenaltyNo);
            resultMap.put("rows", vendorPenaltyDetailResult.getListFundVendorPanaltyTrackDto());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 删除供应商罚款信息
     *
     * @param vendorPenaltyNo 供应商Id
     */
    @RequestMapping(value = "/deleteByFineIDs", method = RequestMethod.POST)
    @ResponseBody
    public WebResult logicDeleteByFineIDs(String vendorPenaltyNo) {
        WebResult webResult = new WebResult();
        VendorPenaltyBacthResult batchDelVendorPenaltyResult = new VendorPenaltyBacthResult();
        VendorPenaltyBatchRequest vendorPenaltyBatchRequest = new VendorPenaltyBatchRequest();
        VendorPenaltyBatchDto vendorPenaltyBatchDto = new VendorPenaltyBatchDto();
        try {

            List<String> idList =  Arrays.asList(vendorPenaltyNo.split(","));
            vendorPenaltyBatchDto.setPenaltyNoList(idList);
            vendorPenaltyBatchRequest.setVendorPenaltyBatchDto(vendorPenaltyBatchDto);
            batchDelVendorPenaltyResult = vendorPenaltyFacade.batchDelVendorPenalty(vendorPenaltyBatchRequest);
            if (batchDelVendorPenaltyResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                StringBuilder sbf = new StringBuilder();
                if (batchDelVendorPenaltyResult.getListSuccessAuditRet() != null && batchDelVendorPenaltyResult.getListSuccessAuditRet().size() > 0) {
                    sbf.append("操作成功");
                    sbf.append(batchDelVendorPenaltyResult.getListSuccessAuditRet().size()).append("条").append(",");
                }
                if (batchDelVendorPenaltyResult.getListFailAuditRet() != null && batchDelVendorPenaltyResult.getListFailAuditRet().size() > 0) {
                    sbf.append("操作失败");
                    sbf.append(batchDelVendorPenaltyResult.getListFailAuditRet().size()).append("条").append(",");
                }

                if (batchDelVendorPenaltyResult.getListFailAuditRet() != null && batchDelVendorPenaltyResult.getListFailAuditRet().size() > 0) {
                    for (VendorPenaltyBatchRetDto vendorPenaltyBatchRetDto : batchDelVendorPenaltyResult.getListFailAuditRet()) {
                        sbf.append("单号").append(vendorPenaltyBatchRetDto.getVendorPenaltyNo());
                        sbf.append(vendorPenaltyBatchRetDto.getRspDesc()).append(",");
                    }
                }
                String result = sbf.toString();
                if (result.endsWith(",")) {
                    result = result.substring(0, result.length() - 1);
                }
                webResult.setRspDesc(result);
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("操作失败");
            }
        } catch (Exception e) {
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("删除失败");
            e.printStackTrace();
        }
        return webResult;
    }

    /**
     * 供应商罚款信息确认
     *
     * @param vendorPenaltyNo 供应商Id
     */
    @RequestMapping(value = "/confirmByFineIds", method = RequestMethod.POST)
    @ResponseBody
    public WebResult confirmByFineIds(String vendorPenaltyNo) {
        WebResult webResult = new WebResult();
        VendorPenaltyBacthResult batchDelVendorPenaltyResult = new VendorPenaltyBacthResult();
        VendorPenaltyBatchRequest vendorPenaltyBatchRequest = new VendorPenaltyBatchRequest();
        VendorPenaltyBatchDto vendorPenaltyBatchDto = new VendorPenaltyBatchDto();
        try {
            List<String> idList = new LinkedList<>();
            vendorPenaltyBatchDto.setUserId(UserLoginInfoUtil.getUserId(request));
            vendorPenaltyBatchDto.setUserName(UserLoginInfoUtil.getUserName(request));
            vendorPenaltyBatchDto.setTmAudit(new Date());
            idList.add(vendorPenaltyNo);
            vendorPenaltyBatchDto.setPenaltyNoList(idList);
            vendorPenaltyBatchRequest.setVendorPenaltyBatchDto(vendorPenaltyBatchDto);
            batchDelVendorPenaltyResult = vendorPenaltyFacade.batchConfVendorPenalty(vendorPenaltyBatchRequest);
            if (batchDelVendorPenaltyResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRspDesc("操作成功");
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("操作失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }

    /**
     * 反供应商罚款信息确认
     *
     * @param vendorPenaltyNo 供应商Id
     */
    @RequestMapping(value = "/unConfirmByFineIds", method = RequestMethod.POST)
    @ResponseBody
    public WebResult unConfirmByFineIds(String vendorPenaltyNo) {
        WebResult webResult = new WebResult();
        VendorPenaltyBacthResult batchDelVendorPenaltyResult = new VendorPenaltyBacthResult();
        VendorPenaltyBatchRequest vendorPenaltyBatchRequest = new VendorPenaltyBatchRequest();
        VendorPenaltyBatchDto vendorPenaltyBatchDto = new VendorPenaltyBatchDto();
        try {
            List<String> idList = new LinkedList<>();
            idList.add(vendorPenaltyNo);
            vendorPenaltyBatchDto.setPenaltyNoList(idList);
            vendorPenaltyBatchDto.setUserId(UserLoginInfoUtil.getUserId(request));
            vendorPenaltyBatchDto.setUserName(UserLoginInfoUtil.getUserName(request));
            vendorPenaltyBatchDto.setTmAudit(new Date());
            vendorPenaltyBatchRequest.setVendorPenaltyBatchDto(vendorPenaltyBatchDto);
            batchDelVendorPenaltyResult = vendorPenaltyFacade.batchReconfVendorPenalty(vendorPenaltyBatchRequest);
            if (batchDelVendorPenaltyResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRspDesc("操作成功");
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("操作失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }


    /**
     * 供应商罚款信息审核
     *
     * @param vendorPenaltyNo 供应商Id
     */
    @RequestMapping(value = "/firstCheckByFineIds", method = RequestMethod.POST)
    @ResponseBody
    public WebResult firstCheckByFineIds(String vendorPenaltyNo) {
        WebResult webResult = new WebResult();
        VendorPenaltyBacthResult batchDelVendorPenaltyResult = new VendorPenaltyBacthResult();
        VendorPenaltyBatchRequest vendorPenaltyBatchRequest = new VendorPenaltyBatchRequest();
        VendorPenaltyBatchDto vendorPenaltyBatchDto = new VendorPenaltyBatchDto();
        try {
            List<String> idList = new LinkedList<>();
            idList.add(vendorPenaltyNo);
            vendorPenaltyBatchDto.setPenaltyNoList(idList);
            vendorPenaltyBatchDto.setUserId(UserLoginInfoUtil.getUserId(request));
            vendorPenaltyBatchDto.setUserName(UserLoginInfoUtil.getUserName(request));
            vendorPenaltyBatchDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            vendorPenaltyBatchDto.setTmAudit(new Date());
            vendorPenaltyBatchDto.setStatus(VendorPenaltyEnum.FIRSTCHECK_PASS.getValueDefined());
            vendorPenaltyBatchRequest.setVendorPenaltyBatchDto(vendorPenaltyBatchDto);
            batchDelVendorPenaltyResult = vendorPenaltyFacade.batchFirstCheck(vendorPenaltyBatchRequest);
            if (batchDelVendorPenaltyResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRspDesc("操作成功");
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("操作失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }


    /**
     * 获取收款人账户信息
     *
     *
     */
    @RequestMapping(value = "/getVendorBankAccount", method = RequestMethod.POST)
    @ResponseBody
    public WebResult getVendorBankAccount() {
        WebResult webResult = new WebResult();
        try {
            MerchantResult<VendorDto> merchantResult = vendorFacade.getXsVendorInfo(0);

            if (merchantResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRecord(merchantResult.getData());
            } else {
                //失败
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("兴盛账户信息查询失败！");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return webResult;
    }

    /**
     * 查询供应商账户金额
     *
     * @param vendorId 供应商Id
     */
    @RequestMapping(value = "/getVendorBalanceAmount", method = RequestMethod.POST)
    @ResponseBody
    public WebResult getVendorBalanceAmount(long vendorId) {

        WebResult webResult = new WebResult();
        VendorCanWithdrawResult vendorCanWithdrawResult = null;
        try {
            VendorWithdrawQryRequest vendorWithdrawQryRequest = new VendorWithdrawQryRequest();
            vendorWithdrawQryRequest.setVendorId(vendorId);
            vendorWithdrawQryRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            vendorCanWithdrawResult = vendorWithdrawFacade.findVendorCanWithdraw(vendorWithdrawQryRequest);
            if (vendorCanWithdrawResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRecord(vendorCanWithdrawResult.getCanWithdrawDto());
            } else {
                webResult.setRspCode(ResponseCode.FAILED);
                webResult.setRspDesc("供应商账户金额查询失败！");
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("供应商账户金额查询失败！");
        }
        return webResult;
    }

    /**
     * 供应商罚款添加  查询供应商活动商品
     */
    @RequestMapping(value = "/getVendorActivityProductPageList", method = RequestMethod.POST)
    @ResponseBody
    public Map getVendorActivityProductPageList(long vendorId, String productName, String sku, String tmBuyStart, String tmBuyEnd, int page, int rows) {
        Map resultMap = new HashMap();
        PromotionBaseResult<Page<PreproductDto>> promotionBaseResult = null;
        try {
            VendorPreproductQueryDto vendorPreproductQueryDto = new VendorPreproductQueryDto();
            vendorPreproductQueryDto.setVendorId(vendorId);
            if (productName != null && !"".equals(productName)) {
                vendorPreproductQueryDto.setProductName(productName);
            }
            if (sku != null && !"".equals(sku)) {
                vendorPreproductQueryDto.setSku(sku);
            }
            if (tmBuyStart != null && !"".equals(tmBuyStart)) {
                vendorPreproductQueryDto.setTmBuyStart(strToDateLong(tmBuyStart));
            }
            if (tmBuyEnd != null && !"".equals(tmBuyEnd)) {
                vendorPreproductQueryDto.setTmBuyEnd(strToDateLong(tmBuyEnd));
            }
            vendorPreproductQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
            Page<PreproductDto> pages = new Page<PreproductDto>();
            pages.setCurrent(page);
            pages.setSize(rows);
            promotionBaseResult = activityPreproductFacade.queryVendorPreproduct(vendorPreproductQueryDto, pages);
            if (promotionBaseResult != null) {
                resultMap.put("rows", promotionBaseResult.getData().getRecords());
                resultMap.put("total", promotionBaseResult.getData().getTotal());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 供应商罚款编辑保存
     *
     * @param formData 供应商Id
     */
    @RequestMapping(value = "/saveVendorFine", method = RequestMethod.POST)
    @ResponseBody
    public WebResult saveVendorFine(VendorPenaltyDto formData) {
        WebResult webResult = new WebResult();
        VendorPenaltyDetailResult vendorPenaltyDetailResult = new VendorPenaltyDetailResult();
        VendorPenaltyDetailRequest vendorPenaltyDetailRequest = new VendorPenaltyDetailRequest();
        try {
            vendorPenaltyDetailRequest.setVendorPenaltyDto(formData);
            if (formData != null && formData.getVendorPenaltyNo() != null) {
                formData.setModifyUserId(UserLoginInfoUtil.getUserId(request));
                formData.setModifyUserName(UserLoginInfoUtil.getUserName(request));
                formData.setTmSmp(new Date());

                vendorPenaltyDetailResult = vendorPenaltyFacade.updateVendorPenalty(vendorPenaltyDetailRequest);
            } else {
                formData.setTmCreate(new Date());
                formData.setStatus(VendorPenaltyEnum.AREA_APP.getValueDefined());
                formData.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
                formData.setAreaName(UserLoginInfoUtil.getRegionName(request));
                formData.setCreateUserId(UserLoginInfoUtil.getUserId(request));
                formData.setCreateUserName(UserLoginInfoUtil.getUserName(request));
                vendorPenaltyDetailResult = vendorPenaltyFacade.addVendorPenalty(vendorPenaltyDetailRequest);
            }
            if (vendorPenaltyDetailResult.isSuccess()) {
                webResult.setRspCode(ResponseCode.SUCCESS);
                webResult.setRspDesc("操作成功");
            } else {

                //失败 modify by luozujun 2018-04-24
                webResult.setRspCode(ResponseCode.FAILED);
                String respInfo = vendorPenaltyDetailResult.getRspInfo();
                if (StringUtils.isEmpty(respInfo)) {
                    ErrorContext errorContext = vendorPenaltyDetailResult.getErrorContext();
                    respInfo = errorContext.fetchCurrentError().getErrorMsg();
                }
                webResult.setRspDesc(respInfo);
            }
        } catch (Exception e) {
            e.printStackTrace();
            webResult.setRspCode(ResponseCode.FAILED);
            webResult.setRspDesc("操作失败");
        }
        return webResult;
    }

    /**
     * 供应商罚款导出
     */
    @RequestMapping(value = "downloadList", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public List<VendorPenaltyDto> downloadList(VendorPenaltyQryRequest vendorPenaltyQryRequest) {
        //页面没有时分秒格式，结束时间加一天
        if (vendorPenaltyQryRequest.getPenaltyDateEnd() != null) {
            Calendar c = Calendar.getInstance();
            c.setTime(vendorPenaltyQryRequest.getPenaltyDateEnd());
            // 今天+1天
            c.add(Calendar.DAY_OF_MONTH, 1);
            vendorPenaltyQryRequest.setPenaltyDateEnd(c.getTime());
        }
        VendorPenaltyQryResult vendorPenaltyQryResult = null;
        List<VendorPenaltyDto> list = new LinkedList<>();
        try {
            vendorPenaltyQryRequest.setFooterFlag(Constants.SHOWFOOTER_ONE);
            vendorPenaltyQryRequest.setRows(Integer.MAX_VALUE);
            vendorPenaltyQryRequest.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
            vendorPenaltyQryResult = vendorPenaltyFacade.selectListVendorPenalty(vendorPenaltyQryRequest);
            list = vendorPenaltyQryResult.getRows();
            list.addAll(vendorPenaltyQryResult.getFooter());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    private Date strToDateLong(String strDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = formatter.parse(strDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    @RequestMapping(value = "vendorFineType", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<SysDictDetailDto> storeProdReturnType() {
        List<SysDictDetailDto> list = new ArrayList<>();
        SysDictDetailDto req = new SysDictDetailDto();
        req.setAreaId(null);
        req.setDictCode(SysDictEnum.FINE_TYPE.getDictCode());
        try {
            MerchantResult<List<SysDictDetailDto>> result = sysDictDetailFacade.listSysDictDetail(req);
            list = result.getData();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}