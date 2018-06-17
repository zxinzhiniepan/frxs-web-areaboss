/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */
package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.framework.util.common.log4j.LogUtil;
import com.frxs.merchant.service.api.dto.ProductVendorDataDto;
import com.frxs.merchant.service.api.dto.ProductVendorDataQueryDto;
import com.frxs.merchant.service.api.dto.ProductVendorDto;
import com.frxs.merchant.service.api.dto.VendorProductDataOperateDto;
import com.frxs.merchant.service.api.facade.ProductVendorDataFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.PackZipUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jodd.util.URLDecoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author wuwu
 * @version $Id: VendorGoodsWebApiController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@Controller
@RequestMapping("/vendor")
public class VendorGoodsWebApiController {

    @Reference(check = false, version = "1.0.0",timeout = 30000)
    ProductVendorDataFacade productVendorDataFacade;

    @Autowired
    PackZipUtil packZipUtil;

    /**
     * 根据id删除供应商商品管理信息
     */
    @RequestMapping(value = {"/vendorProductsDelete"}, method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public WebResult vendorProductsDelete(String ids, HttpServletRequest request) {
        VendorProductDataOperateDto vendorProductDataOperateDto = new VendorProductDataOperateDto();
        MerchantResult merchantResult = null;
        WebResult webResult = new WebResult();
        vendorProductDataOperateDto.setOperateId(UserLoginInfoUtil.getUserId(request));
        vendorProductDataOperateDto.setOperateName(UserLoginInfoUtil.getUserName(request));
        List<Long> productDataId = new ArrayList<>();
        if (ids.contains("&") || ids.contains("=")) {
            String idsArr[] = ids.split("&");
            for (int i = 0; i < idsArr.length; i++) {
                String id = idsArr[i].substring(20, idsArr[i].length());
                productDataId.add(Long.parseLong(id));
            }
        } else {
            productDataId.add(Long.parseLong(ids));
        }
        vendorProductDataOperateDto.setVendorProductDataIdList(productDataId);
        merchantResult = productVendorDataFacade.areaDel(vendorProductDataOperateDto);
        if (merchantResult.isSuccess()) {
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("删除成功");
        } else {
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 分页查询供应商商品管理信息
     */
    @RequestMapping(value = "/getVendorProductsPageList", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public Map<String, Object> getVendorProductsPageList(HttpServletRequest request,ProductVendorDataQueryDto productVendorDataQueryDto, int page, int rows) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        MerchantResult<Page<ProductVendorDataDto>> merchantResult = null;
        productVendorDataQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        Page<ProductVendorDataDto> pageDto = new Page<>();
        pageDto.setCurrent(page);
        pageDto.setSize(rows);
        merchantResult = productVendorDataFacade.productVendorDataList(productVendorDataQueryDto, pageDto);
        resultMap.put("rows", merchantResult.getData().getRecords());
        resultMap.put("total", merchantResult.getData().getTotal());
        return resultMap;
    }

    /**
     * 供应商商品导出
     */
    @RequestMapping(value = "/vendorProductsExport", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public List<ProductVendorDataDto> vendorProductsExport(HttpServletRequest request,ProductVendorDataQueryDto productVendorDataQueryDto) {
        MerchantResult<Page<ProductVendorDataDto>> merchantResult = null;
        productVendorDataQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        Page<ProductVendorDataDto> pageDto = new Page<>();
        pageDto.setCurrent(1);
        pageDto.setSize(Integer.MAX_VALUE);
        merchantResult = productVendorDataFacade.productVendorDataList(productVendorDataQueryDto, pageDto);
        return merchantResult.getData().getRecords();
    }

    /**
     * 根据id查看详情与审核页面
     */
    @RequestMapping(value = "/vendorProductsDetails", method = {RequestMethod.POST, RequestMethod.GET})
    public String vendorProductsDetails(Long vendorProductDataId, ModelMap map) {
        MerchantResult<ProductVendorDto> merchantResult = null;
        merchantResult = productVendorDataFacade.previewProductVendor(vendorProductDataId);
        map.addAttribute("rts", merchantResult.getData().getProdVendorData());
        map.addAttribute("rta", merchantResult.getData().getAttrs());
        map.addAttribute("rtb", merchantResult.getData().getImgs());
        return "vendor/vendorProductDetails";
    }

    /**
     * 供应商商品信息审核与驳回审核
     */
    @RequestMapping(value = "/vendorProductAudit", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public WebResult vendorProductAudit(Long vendorProductDataId, String auditStatus, String auditRession, HttpServletRequest request) {
        MerchantResult merchantResult = null;
        WebResult webResult = new WebResult();
        VendorProductDataOperateDto vendorProductDataOperateDto = new VendorProductDataOperateDto();
        List<Long> vendorProductDataIdList = new ArrayList<>();
        vendorProductDataIdList.add(vendorProductDataId);
        vendorProductDataOperateDto.setAuditStatus(auditStatus);
        vendorProductDataOperateDto.setVendorProductDataIdList(vendorProductDataIdList);
        vendorProductDataOperateDto.setAuditRession(auditRession);
        vendorProductDataOperateDto.setOperateId(UserLoginInfoUtil.getUserId(request));
        vendorProductDataOperateDto.setOperateName(UserLoginInfoUtil.getUserName(request));
        merchantResult = productVendorDataFacade.updateAuditStatus(vendorProductDataOperateDto);
        if (merchantResult.isSuccess()) {
            webResult.setRspCode(ResponseCode.SUCCESS);
            if ("PASS".equals(auditStatus)) {
                webResult.setRspDesc("审核操作成功");
            } else if ("REJECT".equals(auditStatus)) {
                webResult.setRspDesc("审核驳回成功");
            }
        } else {
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }

        return webResult;
    }

    /**
     * 生成下载的文件
     */
    @RequestMapping(value = "/downloadImage")
    @ResponseBody
    public void downloadImage(HttpServletResponse response, String urls, String fileName) throws IOException {
        if (urls != null) {
            String[] imgs = urls.split(",");
            ZipOutputStream zos = null;
            try {
                String fName = new String(URLDecoder.decode(fileName).getBytes(), "ISO-8859-1");
                String downloadFilename = fName + ".zip";
                response.reset();
                response.setContentType("application/octet-stream");
                response.setHeader("Content-Disposition", "attachment;filename=" + downloadFilename);
                zos = new ZipOutputStream(response.getOutputStream());
                for (int i = 0; i < imgs.length; i++) {
                    String imgUrl = imgs[i];
                    URL url = new URL(imgUrl);
                    String imgName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1, imgUrl.length());
                    String sufix = imgName.substring(imgName.lastIndexOf("."), imgName.length());
                    if (imgName.length() > 100) {
                        imgName = UUID.randomUUID().toString() + sufix;
                    }
                    zos.putNextEntry(new ZipEntry(imgName));
                    InputStream fis = url.openConnection().getInputStream();
                    byte[] buffer = new byte[1024];
                    int r = 0;
                    while ((r = fis.read(buffer)) != -1) {
                        zos.write(buffer, 0, r);
                    }
                    fis.close();
                }
                zos.flush();
                zos.close();
            } catch (Exception e) {
                LogUtil.error(e, "图片打包下载失败");
                throw new RuntimeException("下载失败");
            } finally {
                if (zos != null) {
                    zos.flush();
                    zos.close();
                }
            }
        }
    }
}