package com.frxs.web.areaboss.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;

/**
 * 图片压缩工具
 *
 * @author fygu
 * @version $Id: CompressImgTools.java,v 0.1 2018年02月10日 12:51 $Exp
 */
public class CompressImgTools {

    private static float QUALITY = 0.6f;

    /**
     * 按大小缩小
     *
     * @param file
     * @param width
     * @param height
     * @return
     * @throws Exception
     */
    public static byte[] compressOfSize(File file, int width, int height)
        throws Exception {
        byte[] bs = null;
        InputStream input = null;
        try {
            input = new FileInputStream(file);
            bs = compressOfSize(input, width, height);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (input != null) {
                    input.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return bs;
    }

    /**
     * 按大小缩小
     *
     * @param input 原图
     * @param width 目标宽席
     * @param height 目标高度
     * @return
     * @throws Exception
     */
    public static byte[] compressOfSize(InputStream input, int width, int height)
        throws Exception {
        ByteArrayOutputStream output = null;
        try {
            output = new ByteArrayOutputStream();
            Thumbnails.of(input).size(width, height).toOutputStream(output);
            return output.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (output != null) {
                    output.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 按指定比例进行缩小和放大: percent=1不变 percent>1放大 percent<1缩小
     *
     * @param input 原图
     * @param percent 压缩比例
     * @return
     * @throws Exception
     */
    public static byte[] compressOfPercent(InputStream input, float percent)
        throws Exception {
        ByteArrayOutputStream output = null;
        try {
            output = new ByteArrayOutputStream();
            Thumbnails.of(input).scale(percent).toOutputStream(output);
            return output.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (output != null) {
                    output.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 按指定比例进行缩小和放大: percent=1不变 percent>1放大 percent<1缩小
     *
     * @param file 原图
     * @param percent 压缩比例
     */
    public static byte[] compressOfPercent(File file, float percent)
        throws Exception {
        byte[] bs = null;
        InputStream input = null;
        try {
            input = new FileInputStream(file);
            bs = compressOfPercent(input, percent);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (input != null) {
                    input.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return bs;
    }

    /**
     * 按质量压缩:图片尺寸不变，压缩图片文件大小
     *
     * @param file 原图
     * @param quality
     *            =1为最高质量
     * @return
     * @throws Exception
     */
    public static byte[] compressOfQuality(File file, float quality)
        throws Exception {
        byte[] bs = null;
        InputStream input = null;
        try {
            input = new FileInputStream(file);
            bs = compressOfQuality(input, quality);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (input != null) {
                    input.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return bs;
    }

    /**
     * 按质量压缩:图片尺寸不变，压缩图片文件大小
     *
     * @param input 原图
     * @param quality
     *            =1为最高质量
     * @return
     * @throws Exception
     */
    public static byte[] compressOfQuality(InputStream input, float quality)
        throws Exception {
        ByteArrayOutputStream output = null;
        try {
            output = new ByteArrayOutputStream();
            if(quality == 0){
                Thumbnails.of(input).scale(1f).outputQuality(QUALITY)
                    .toOutputStream(output);
            } else {
                Thumbnails.of(input).scale(1f).outputQuality(quality)
                    .toOutputStream(output);
            }
            return output.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (output != null) {
                    output.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 图片右下角添加水印
     *
     * @param fromPic
     *            原图
     * @param markPic
     *            水印图
     * @param transparent
     *            透明度
     * @return
     * @throws Exception
     */
    public static byte[] waterMark(byte[] fromPic, InputStream markPic,
        float transparent){
        InputStream finput = null;
        ByteArrayOutputStream output = null;
        try {
            finput = new ByteArrayInputStream(fromPic);
            output = new ByteArrayOutputStream();
            Thumbnails
                .of(finput)
                .scale(1f)
                .watermark(Positions.BOTTOM_RIGHT, ImageIO.read(markPic),
                    transparent).toOutputStream(output);
            return output.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (output != null)
                    output.close();
                if (finput != null)
                    finput.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 图片格式转换
     *
     * @param fromPic
     *            原图
     * @param picFormat
     *            格式 png,jpg...
     * @return
     * @throws Exception
     */
    public static byte[] transferPicFormat(byte[] fromPic, String picFormat)
        throws Exception {
        ByteArrayInputStream finput = null;
        ByteArrayOutputStream output = null;
        try {
            finput = new ByteArrayInputStream(fromPic);
            output = new ByteArrayOutputStream();
            Thumbnails.of(finput).outputFormat(picFormat)
                .toOutputStream(output);
            return output.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (output != null)
                    output.close();
                if (finput != null)
                    finput.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

}
