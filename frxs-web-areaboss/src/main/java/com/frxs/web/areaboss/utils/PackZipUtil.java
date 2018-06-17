package com.frxs.web.areaboss.utils;


import com.frxs.framework.util.common.StringUtil;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 图片压缩zip工具
 *
 * @author fygu
 * @version $Id: ImgPackZipUtil.java,v 0.1 2018年02月10日 11:03 $Exp
 */
@Component
public class PackZipUtil {

    @Value("${temp.file.dir}")
    private String temFilDir;

    @Autowired
    private HttpClientUtil httpClientUtil;


    /**
     * 读取网络图片打成打成ZIP
     *
     * @param urls key = 图片名, value = 图片URL
     */
    public String compressImgZip(List<String> urls) {

        String strZipPath = null;
        ZipOutputStream out = null;
        CloseableHttpResponse response = null;
        try {
            String zipName = String.valueOf(System.currentTimeMillis());
            if (StringUtil.isBlank(temFilDir)) {
                temFilDir = System.getProperty("user.dir");
            }
            File baseFile = new File(temFilDir);
            if (!baseFile.exists()) {
                baseFile.mkdir();
            }
            String fileDir = temFilDir + File.separator + "vendorProductImg";
            strZipPath = fileDir + File.separator + zipName + ".zip";
            File file = new File(fileDir);
            if (!file.exists()) {
                if (!file.mkdir()) {
                    throw new RuntimeException("文件创建失败");
                }
            }
            out = getZipStreamEncode(new FileOutputStream(strZipPath), null);
            for (int i = 0; i < urls.size(); i++) {
                String url = urls.get(i);
                response = httpClientUtil.getCloseableHttpResponseGet(url);
                if (response == null || HttpStatus.SC_OK != response.getStatusLine().getStatusCode()) {
                    throw new RuntimeException("图片下载失败");
                }
                String fileName = url.substring(url.lastIndexOf("/") + 1, url.length());
                String sufix = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                if (fileName.length() > 100) {
                    fileName = UUID.randomUUID().toString() + sufix;
                }
                zip(response.getEntity().getContent(), out, fileName);
                response.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return strZipPath;
    }

    /**
     * 获取压缩编码
     */
    private ZipOutputStream getZipStreamEncode(OutputStream output, String encode) {
        ZipOutputStream zipStream = new ZipOutputStream(output);
        if (StringUtil.isBlank(encode)) {
            zipStream.setEncoding("UTF-8");
        } else {
            zipStream.setEncoding(encode);
        }
        return zipStream;
    }

    /**
     * 压缩成zip包
     *
     * @param input 输入流
     * @param zipStream zip流
     * @param zipEntryName zip包名
     */
    private void zip(InputStream input, ZipOutputStream zipStream, String zipEntryName) throws Exception {
        byte[] bytes = null;
        BufferedInputStream bufferStream = null;
        try {
            if (input == null) {
                throw new RuntimeException("获取压缩的数据项失败! 数据项名为：" + zipEntryName);
            }
            // 压缩条目不是具体独立的文件，而是压缩包文件列表中的列表项，称为条目，就像索引一样
            ZipEntry zipEntry = new ZipEntry(zipEntryName);
            // 定位到该压缩条目位置，开始写入文件到压缩包中
            zipStream.putNextEntry(zipEntry);
            // 读写缓冲区
            bytes = new byte[1024 * 5];
            // 输入缓冲流
            bufferStream = new BufferedInputStream(input);
            int read = 0;
            while ((read = bufferStream.read(bytes)) != -1) {
                zipStream.write(bytes, 0, read);
            }
        } catch (IOException e) {
            throw new RuntimeException("zip压缩失败");
        } finally {
            try {
                if (null != bufferStream) {
                    bufferStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    public static void main(String[] args) {

        List<String> createFilesPath = new LinkedList<>();
        createFilesPath.add(
            "http://apiimage.frxs.cn/Product/2017/12/2/a2b8e386-2a35-45c1-8b9a-3d399e621920_640x0.jpg_640x853.jpg");
        createFilesPath.add(
            "http://apiimage.frxs.cn/Product/2017/12/2/9b7c7781-2c7e-45b1-8f85-97109b9c69ff_640x0.jpg_640x853.jpg");
        PackZipUtil packZipUtil = new PackZipUtil();
        packZipUtil.compressImgZip(createFilesPath);

        System.out.print(1111);
    }

}
