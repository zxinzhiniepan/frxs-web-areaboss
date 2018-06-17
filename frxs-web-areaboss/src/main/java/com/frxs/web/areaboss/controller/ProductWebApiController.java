/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.plugins.Page;
import com.frxs.framework.common.errorcode.ErrorContext;
import com.frxs.merchant.service.api.dto.OpLogDto;
import com.frxs.merchant.service.api.dto.ProductAttrvalRelationDto;
import com.frxs.merchant.service.api.dto.ProductDescDto;
import com.frxs.merchant.service.api.dto.ProductDto;
import com.frxs.merchant.service.api.dto.ProductImgDto;
import com.frxs.merchant.service.api.dto.ProductQueryDto;
import com.frxs.merchant.service.api.dto.ProductSortDto;
import com.frxs.merchant.service.api.enums.ProductImgTypeEnum;
import com.frxs.merchant.service.api.enums.ProductSkuStatusEnum;
import com.frxs.merchant.service.api.facade.OpLogFacade;
import com.frxs.merchant.service.api.facade.ProductFacade;
import com.frxs.merchant.service.api.result.MerchantResult;
import com.frxs.web.areaboss.dto.ProductDescModDto;
import com.frxs.web.areaboss.dto.ProductAddOrUpdateDto;
import com.frxs.web.areaboss.dto.ProductOpLogDto;
import com.frxs.web.areaboss.result.ResponseCode;
import com.frxs.web.areaboss.result.WebResult;
import com.frxs.web.areaboss.utils.BeanConvertUtils;
import com.frxs.web.areaboss.utils.IdsConverterUtil;
import com.frxs.web.areaboss.utils.UserLoginInfoUtil;

import java.util.*;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author liudiwei
 * @version $Id: ProductWebApiController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@RestController
@RequestMapping("/products")
public class ProductWebApiController {

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    ProductFacade productFacade;

    @Reference(check = false,version = "1.0.0",timeout = 30000)
    OpLogFacade opLogFacade;

    /**
     * 商品展示列表
     *
     * @param productQueryDto 商品id
     * @param page 分页参数
     * @param rows 分页参数
     */
    @RequestMapping(value = {"/getPageList"})
    public Map getPageList(HttpServletRequest request,ProductQueryDto productQueryDto,int page,int rows) {
        Map resultMap = new HashMap();
        MerchantResult<Page<ProductDto>> merchantResult = null;
        Page<ProductDto> pageDto = new Page<>();
        pageDto.setCurrent(page);
        pageDto.setSize(rows);
        productQueryDto.setAreaId(UserLoginInfoUtil.getRegionId(request));
        merchantResult = productFacade.productQueryList(productQueryDto,pageDto);
        resultMap.put("rows",merchantResult.getData().getRecords());
        resultMap.put("total",merchantResult.getData().getTotal());
        return resultMap;
    }

    /**
     * 创建单规格商品
     *
     * @param saveData 商品信息
     */
    @RequestMapping(value = {"/createSingleProduct"})
    public WebResult<Long> createSingleProduct(HttpServletRequest request,ProductAddOrUpdateDto saveData){
        ProductDto product = new ProductDto();
        BeanConvertUtils.copyProperties(saveData,product);
        MerchantResult<Long> merchantResult = null;
        product.setCreateUserId(UserLoginInfoUtil.getUserId(request));
        product.setCreateUserName(UserLoginInfoUtil.getUserName(request));
        product.setAreaId(UserLoginInfoUtil.getRegionId(request));
        ProductAttrvalRelationDto productAttrvalRelation = new ProductAttrvalRelationDto();
        if(saveData.getAttrVal()!=null&&!"".equals(saveData.getAttrVal())){
            productAttrvalRelation.setAttrVal(saveData.getAttrVal());
        }
        List<ProductImgDto> productImgList = new ArrayList<>();
        if(saveData.getDetailUrlsArr()!=null&&!"".equals(saveData.getDetailUrlsArr())){
            productImgList = JSON.parseArray(saveData.getDetailUrlsArr(),ProductImgDto.class);
            if(productImgList!=null&&productImgList.size()>0){
                for(ProductImgDto productImgDto:productImgList){
                    productImgDto.setImgType(ProductImgTypeEnum.PRIMARY.getValueDefined());
                }
            }
        }
        if(saveData.getAdvertisementImageSrc()!=null&&!"".equals(saveData.getAdvertisementImageSrc())){
            ProductImgDto productImgDto = new ProductImgDto();
            productImgDto.setOriginalImgUrl(saveData.getAdvertisementImageSrc());
            productImgDto.setImgType(ProductImgTypeEnum.AD.getValueDefined());
            productImgDto.setTmCreate(new Date());
            productImgList.add(productImgDto);
        }
        merchantResult = productFacade.createSingleProduct(product,productAttrvalRelation,productImgList);
        OpLogDto opLogDto = new OpLogDto();
        ProductOpLogDto productOpLogDto = new ProductOpLogDto();
        BeanConvertUtils.copyProperties(saveData,productOpLogDto);
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("94");
        opLogDto.setMenuName("2A商品管理");
        opLogDto.setAction("2D商品手动添加");
        if(productOpLogDto!=null){
            opLogDto.setRemark(JSON.toJSONString(productOpLogDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        WebResult<Long> webResult = new WebResult<>();
        if(merchantResult.isSuccess()){
            if(merchantResult.getData()!=null){
                webResult.setRecord(merchantResult.getData());
            }
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("商品新增成功！");
        }else{
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 更新商品图文
     *
     * @param saveData 描述
     * @return 结果
     */
    @RequestMapping(value = {"/updateProductDesc"})
    public WebResult updateProductDesc(HttpServletRequest request,ProductDescModDto saveData){
        MerchantResult merchantResult = null;
        ProductDescDto productDesc = new ProductDescDto();
        if(saveData.getProductId()!=null&&!"".equals(saveData.getProductId())){
            productDesc.setProductId(saveData.getProductId());
        }
        if(saveData.getDetailDesc()!=null&&!"".equals(saveData.getDetailDesc())){
            productDesc.setDetailDesc(saveData.getDetailDesc());
        }
        productDesc.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        productDesc.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        List<ProductImgDto> descImgList = new ArrayList<>();
        if(saveData.getDetailPicArr()!=null&&!"".equals(saveData.getDetailPicArr())){
            descImgList = JSON.parseArray(saveData.getDetailPicArr(),ProductImgDto.class);
            if(descImgList!=null&&descImgList.size()>0){
                for(ProductImgDto productImgDto:descImgList){
                    productImgDto.setImgType(ProductImgTypeEnum.DETAIL.getValueDefined());
                }
            }
        }
        merchantResult = productFacade.updateProductDesc(productDesc,descImgList);
        WebResult webResult = new WebResult();
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("更新商品图文成功！");
        }else{
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 修改单规格属性商品
     *
     * @param saveData 商品信息
     *
     */
    @RequestMapping(value = {"/updateSingleProduct"})
    public WebResult updateSingleProduct(HttpServletRequest request,ProductAddOrUpdateDto saveData){
        ProductDto product = new ProductDto();
        BeanConvertUtils.copyProperties(saveData,product);
        MerchantResult merchantResult = null;
        product.setModifyUserId(UserLoginInfoUtil.getUserId(request));
        product.setModifyUserName(UserLoginInfoUtil.getUserName(request));
        product.setAreaId(UserLoginInfoUtil.getRegionId(request));
        ProductAttrvalRelationDto productAttrvalRelation = new ProductAttrvalRelationDto();
        if(saveData.getAttrVal()!=null&&!"".equals(saveData.getAttrVal())){
            productAttrvalRelation.setAttrVal(saveData.getAttrVal());
        }
        List<ProductImgDto> productImgList = new ArrayList<>();
        if(saveData.getDetailUrlsArr()!=null&&!"".equals(saveData.getDetailUrlsArr())){
            productImgList = JSON.parseArray(saveData.getDetailUrlsArr(),ProductImgDto.class);
            if(productImgList!=null&&productImgList.size()>0){
                for(ProductImgDto productImgDto:productImgList){
                    productImgDto.setImgType(ProductImgTypeEnum.PRIMARY.getValueDefined());
                }
            }
        }
        if(saveData.getAdvertisementImageSrc()!=null&&!"".equals(saveData.getAdvertisementImageSrc())){
            ProductImgDto productImgDto = new ProductImgDto();
            productImgDto.setOriginalImgUrl(saveData.getAdvertisementImageSrc());
            productImgDto.setImgType(ProductImgTypeEnum.AD.getValueDefined());
            productImgDto.setTmSmp(new Date());
            productImgList.add(productImgDto);
        }
        merchantResult = productFacade.updateSingleProduct(product,productAttrvalRelation,productImgList);
        OpLogDto opLogDto = new OpLogDto();
        ProductOpLogDto productOpLogDto = new ProductOpLogDto();
        BeanConvertUtils.copyProperties(saveData,productOpLogDto);
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("94");
        opLogDto.setMenuName("2A商品管理");
        opLogDto.setAction("修改商品");
        if(productOpLogDto!=null){
            opLogDto.setRemark(JSON.toJSONString(productOpLogDto));
        }
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);
        WebResult webResult = new WebResult();
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("商品修改成功！");
        }else{
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 逻辑删除商品  ids可以是一个也可以是多个 根据删除商品时需要判断商品是否已经加入活动
     *
     * @param ids 商品id
     */
    @RequestMapping(value = {"/productDelete"})
    public WebResult delProducts(String ids ,HttpServletRequest request) {
        MerchantResult merchantResult = null;
        ProductSortDto productSortDto = new ProductSortDto();
        List<Long> idList = IdsConverterUtil.IdsConverter(ids);
        productSortDto.setProductIds(idList);
        productSortDto.setAreaId((long)UserLoginInfoUtil.getRegionId(request));
        productSortDto.setOperateId(UserLoginInfoUtil.getUserId(request));
        productSortDto.setOperateName(UserLoginInfoUtil.getUserName(request));
        productSortDto.setOperateDate(new Date());
        merchantResult = productFacade.delProducts(productSortDto);

        WebResult webResult = new WebResult();
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            webResult.setRspDesc("商品删除成功");
        }else{
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }
        return webResult;
    }

    /**
     * 上下架 productId
     *
     * @param productSortDto 商品Dto
     */
    @RequestMapping(value = {"/upselling"})
    public WebResult updateSkuStatus(ProductSortDto productSortDto, HttpServletRequest request) {
        productSortDto.setAreaId((long)UserLoginInfoUtil.getRegionId(request));
        productSortDto.setOperateId(UserLoginInfoUtil.getUserId(request));
        productSortDto.setOperateName(UserLoginInfoUtil.getUserName(request));
        productSortDto.setOperateDate(new Date());
        MerchantResult merchantResult = productFacade.updateSkuStatus(productSortDto);

        OpLogDto opLogDto = new OpLogDto();
        opLogDto.setAreaId(UserLoginInfoUtil.getRegionId(request).intValue());
        opLogDto.setMenuId("94");
        opLogDto.setMenuName("2A商品管理");
        Map map = new HashMap();
        map.put("操作人",UserLoginInfoUtil.getUserName(request));
        map.put("操作人ID",UserLoginInfoUtil.getUserId(request));
        if(productSortDto!=null&&productSortDto.getSkuStatus()!=null&& ProductSkuStatusEnum.UP.getValue().equals(productSortDto.getSkuStatus())){
            opLogDto.setAction("商品上架");
        }else{
            opLogDto.setAction("商品下架");
        }
        opLogDto.setRemark(map.toString());
        opLogDto.setOperatorId(UserLoginInfoUtil.getUserId(request).intValue());
        opLogDto.setOperatorName(UserLoginInfoUtil.getUserName(request));
        opLogFacade.createLog(opLogDto);

        WebResult webResult = new WebResult();
        if(merchantResult.isSuccess()){
            webResult.setRspCode(ResponseCode.SUCCESS);
            if(productSortDto!=null&&productSortDto.getSkuStatus()!=null&& ProductSkuStatusEnum.UP.getValue().equals(productSortDto.getSkuStatus())){
                webResult.setRspDesc("商品上架成功");
            }else{
                webResult.setRspDesc("商品下架成功");
            }
        }else{
            //失败
            webResult.setRspCode(ResponseCode.FAILED);
            ErrorContext errorContext1 = merchantResult.getErrorContext();
            webResult.setRspCode(errorContext1.fetchCurrentErrorCode());
            webResult.setRspDesc(errorContext1.fetchCurrentError().getErrorMsg());
        }

        return webResult;
    }

    /**
     * 获取商品详情
     *
     * @param productId 商品id
     */
    @RequestMapping(value = {"/selectProductsById"})
    public ProductDto selectProductsById(Long productId) {
        MerchantResult<ProductDto> merchantResult = null;
        ProductDto productDto = null;
        merchantResult = productFacade.queryProductDetail(productId);
        if(merchantResult.getData()!=null){
            productDto = merchantResult.getData();
        }
        return productDto;
    }
}
