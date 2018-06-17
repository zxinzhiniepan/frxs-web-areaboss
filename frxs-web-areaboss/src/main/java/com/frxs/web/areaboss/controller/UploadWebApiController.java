/*
 * frxs Inc.  兴盛社区网络服务股份有限公司
 * Copyright (c) 2017-2017 All Rights Reserved.
 */

package com.frxs.web.areaboss.controller;

import com.frxs.framework.integration.oss.OssService;
import com.frxs.framework.util.common.DateUtil;
import com.frxs.framework.util.common.FileUtils;
import com.frxs.web.areaboss.dto.UploadImgDto;
import com.frxs.web.areaboss.result.ResponseCode;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

/**
 * @author liudiwei
 * @version $Id: UploadWebApiController.java,v 0.1 2018年1月30日 18:39 $Exp
 */
@RestController
public class UploadWebApiController {

    @Autowired
    private OssService ossService;


    @Value("${temp.file.dir}")
    private String temFilDir;

    @Value("${aliyun.oss.url}")
    private String aliyunOssUrl;

    /**
     * 批量上传图片
     *
     * @param request request
     * @return 图片结果集
     */
    @RequestMapping(value = {"/uploadFile"})
    public List<UploadImgDto> batchUploadImg(HttpServletRequest request, String fileDirEnum)
        throws Exception {
        List<UploadImgDto> imgs = new ArrayList<>();
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        List<MultipartFile> files = multipartRequest.getFiles("Filedata");
        String timeStr = DateUtil.format(new Date(), DateUtil.DATA_FORMAT_YYYYMMDD);

        if (!files.isEmpty()) {
            UploadImgDto img;
            String fileDir = fileDirEnum + "/" + timeStr;
            List<File> fileList = new ArrayList<>();
            try {
                for (MultipartFile file : files) {
                    img = new UploadImgDto();
                    String onlyFileName = FileUtils.getFileName(file.getOriginalFilename());

                    String imgContext = aliyunOssUrl + "/" + fileDir;

                    // 图片压缩处理
                    File tempFile = FileUtils.uploadFile(file.getBytes(), temFilDir + File.separator, onlyFileName);

                    String targetFileName = temFilDir + File.separator;
                    //原图的90%
                    String percent90Name = "90percent_" + onlyFileName;
                    Thumbnails.of(tempFile.getAbsoluteFile()).scale(0.9f).outputQuality(0.8f).toFile(targetFileName + percent90Name);
                    File file90 = new File(targetFileName + percent90Name);
                    if (!ossService.postObject(fileDir + "/" + percent90Name, file90.getAbsolutePath())) {
                        img.setStatus(ResponseCode.FAILED);
                        img.setMsg("图片上传失败");
                        imgs.add(img);
                        return imgs;
                    }
                    img.setOriginalImgUrl(imgContext + "/" + percent90Name);

                    //原图的80%
                    String percent80Name = "80percent_" + onlyFileName;
                    Thumbnails.of(tempFile.getAbsoluteFile()).scale(0.8f).outputQuality(0.8f).toFile(targetFileName + percent80Name);
                    File file80 = new File(targetFileName + percent80Name);
                    ossService.postObject(fileDir + "/" + percent80Name, file80.getAbsolutePath());
                    img.setImgUrl400(imgContext + "/" + percent80Name);

                    //原图的70%
                    String percent70Name = "70percent_" + onlyFileName;
                    Thumbnails.of(tempFile.getAbsoluteFile()).scale(0.7f).outputQuality(0.8f).toFile(targetFileName + percent70Name);
                    File file70 = new File(targetFileName + percent70Name);
                    ossService.postObject(fileDir + "/" + percent70Name, file70.getAbsolutePath());
                    img.setImgUrl200(imgContext + "/" + percent70Name);

                    //原图的60%
                    String percent60Name = "60percent_" + onlyFileName;
                    Thumbnails.of(tempFile.getAbsoluteFile()).scale(0.6f).outputQuality(0.8f).toFile(targetFileName + percent60Name);
                    File file60 = new File(targetFileName + percent60Name);
                    ossService.postObject(fileDir + "/" + percent60Name, file60.getAbsolutePath());
                    img.setImgUrl120(imgContext + "/" + percent60Name);

                    //原图的50%
                    String percent50Name = "50percent_" + onlyFileName;
                    Thumbnails.of(tempFile.getAbsoluteFile()).scale(0.5f).outputQuality(0.8f).toFile(targetFileName + percent50Name);
                    File file50 = new File(targetFileName + percent50Name);
                    ossService.postObject(fileDir + "/" + percent50Name, file50.getAbsolutePath());
                    img.setImgUrl60(imgContext + "/" + percent50Name);

                    img.setMsg("图片上传成功");
                    img.setStatus(ResponseCode.SUCCESS);
                    imgs.add(img);

                    fileList.add(tempFile);
                    fileList.add(file90);
                    fileList.add(file80);
                    fileList.add(file70);
                    fileList.add(file60);
                    fileList.add(file50);
                }
            } finally {
                for (File file : fileList) {
                    if (file != null && file.exists()) {
                        file.delete();
                    }
                }
            }
        }
        return imgs;
    }
}