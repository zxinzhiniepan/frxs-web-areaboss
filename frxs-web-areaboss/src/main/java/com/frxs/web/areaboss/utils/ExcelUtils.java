package com.frxs.web.areaboss.utils;

import com.frxs.fund.service.api.domain.dto.refund.StoreRefundDto;
import com.frxs.trade.service.api.dto.base.ExcelDataDto;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Component
public class ExcelUtils {

    private SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    //声明一个该工具类的静态的内部对象
    private static ExcelUtils excelUtils;

    //工具类中需要注入service，dao等需要
    //使用注解@PostConstruct把需要使用的service，dao等加载到上面定义的静态内部对象中
    @PostConstruct
    public void init() {
        excelUtils = this;
    }

    /**
     * excel导出到输出流 谁调用谁负责关闭输出流
     *
     * @param excelExtName excel文件的扩展名，支持xls和xlsx，不带点号
     * @param data excel数据，map中的key是标签页的名称，value对应的list是标签页中的数据。list中的子list是标签页中的一行，子list中的对象是一个单元格的数据，包括是否居中、跨几行几列以及存的值是多少
     */
    public static void writeExceltoFile(OutputStream os, String excelExtName, Map<String, List<List<ExcelDataDto>>> data) throws IOException {
        Workbook wb = null;
        CellStyle cellStyle = null;
        boolean isXls;
        try {
            if ("xls".equals(excelExtName)) {
                wb = new HSSFWorkbook();
                isXls = true;
            } else if ("xlsx".equals(excelExtName)) {
                wb = new XSSFWorkbook();
                isXls = false;
            } else {
                throw new Exception("当前文件不是excel文件");
            }
            cellStyle = wb.createCellStyle();

            for (String sheetName : data.keySet()) {
                Sheet sheet = wb.createSheet(sheetName);
                List<List<ExcelDataDto>> rowList = data.get(sheetName);
                //i 代表第几行 从0开始
                for (int i = 0; i < rowList.size(); i++) {
                    List<ExcelDataDto> cellList = rowList.get(i);
                    Row row = sheet.createRow(i);
                    int j = 0;//j 代表第几列 从0开始
                    for (ExcelDataDto excelDataUtil : cellList) {

                        if (excelDataUtil != null) {
                            if (excelDataUtil.getColSpan() > 1 || excelDataUtil.getRowSpan() > 1) {
                                CellRangeAddress cra = new CellRangeAddress(i, i + excelDataUtil.getRowSpan() - 1, j, j + excelDataUtil.getColSpan() - 1);
                                sheet.addMergedRegion(cra);
                            }
                            Cell cell = row.createCell(j);
                            cell.setCellValue(excelDataUtil.getValue());
                            if (excelDataUtil.isTitle()) {
                                Font font = wb.createFont();
                                font.setFontName("黑体");
                                font.setFontHeightInPoints((short) 16);//设置字体大小
                                font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);//粗体显示
                                cellStyle.setFont(font);
                            }else{
                                cellStyle = wb.createCellStyle();
                                cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                                cellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
                                cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                                cellStyle.setLeftBorderColor(HSSFColor.BLACK.index);
                                cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
                                cellStyle.setRightBorderColor(HSSFColor.BLACK.index);
                                cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
                                cellStyle.setTopBorderColor(HSSFColor.BLACK.index);
                            }

                            if(excelDataUtil.getAlignStyle().equals("left")){
                                cellStyle.setAlignment(XSSFCellStyle.ALIGN_LEFT);
                            }else if(excelDataUtil.getAlignStyle().equals("right")){
                                cellStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
                            }else if(excelDataUtil.getAlignStyle().equals("center")){
                                cellStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);
                            }

                            cell.setCellStyle(cellStyle);

                            if(!excelDataUtil.isTitle() && excelDataUtil.getColSpan() > 1){
                                for(int c = 1;c < excelDataUtil.getColSpan(); c ++){
                                    Cell t = row.createCell(j + c);
                                    t.setCellValue(" ");
                                    cellStyle = wb.createCellStyle();
                                    cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                                    cellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
                                    cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                                    cellStyle.setLeftBorderColor(HSSFColor.BLACK.index);
                                    cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
                                    cellStyle.setRightBorderColor(HSSFColor.BLACK.index);
                                    cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
                                    cellStyle.setTopBorderColor(HSSFColor.BLACK.index);
                                    t.setCellStyle(cellStyle);
                                }
                            }
                            j = j + excelDataUtil.getColSpan();
                        } else {
                            Cell cell = row.createCell(j);
                            cell.setCellValue(" ");
                            cellStyle = wb.createCellStyle();
                            cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                            cellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
                            cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                            cellStyle.setLeftBorderColor(HSSFColor.BLACK.index);
                            cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
                            cellStyle.setRightBorderColor(HSSFColor.BLACK.index);
                            cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
                            cellStyle.setTopBorderColor(HSSFColor.BLACK.index);
                            cell.setCellStyle(cellStyle);
                            j++;
                        }
                    }
                }
            }
            wb.write(os);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (os != null) {
                os.close();
            }
        }
    }

    public static CellStyle getStyle(Workbook workbook) {
        // 创建样式对象
        CellStyle style = workbook.createCellStyle();
        // 设置对齐方式
        // 水平居中
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
        // 垂直居中
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        // 设置边框
        // 顶部边框粗线
        style.setBorderTop(HSSFCellStyle.BORDER_THICK);
        // 设置为红色
        style.setTopBorderColor(HSSFColor.RED.index);
        // 底部边框双线
        style.setBorderBottom(HSSFCellStyle.BORDER_DOUBLE);
        // 左边边框
        style.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
        // 右边边框
        style.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
        // 设置单元格内容是否自动换行
        style.setWrapText(true);
        // 格式化日期
        style.setDataFormat(HSSFDataFormat.getBuiltinFormat("m/d/yy h:mm"));

        // 设置单元格字体
        // 创建字体对象
        Font font = workbook.createFont();
        // 设置字体大小
        font.setFontHeightInPoints((short) 14);
        // 设置字体颜色
        font.setColor(HSSFColor.RED.index);
        // 设置为宋体字
        font.setFontName("宋体");
        // 设置粗体
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 将字体加入到样式对象
        style.setFont(font);

        return style;
    }


    /**
     * 根据当前row行，来创建index标记的列数,并赋值数据
     */
    private void createRowAndCell(Object obj, XSSFRow row, XSSFCell cell, int index) {
        cell = row.getCell(index);
        if (cell == null) {
            cell = row.createCell(index);
        }

        if (obj != null) {
            cell.setCellValue(obj.toString());
        } else {
            cell.setCellValue("");
        }
    }

    /**
     * 复制文件
     *
     * @param s 源文件
     * @param t 复制到的新文件
     */

    public void fileChannelCopy(File s, File t) {
        try {
            InputStream in = null;
            OutputStream out = null;
            try {
                in = new BufferedInputStream(new FileInputStream(s), 1024);
                out = new BufferedOutputStream(new FileOutputStream(t), 1024);
                byte[] buffer = new byte[1024];
                int len;
                while ((len = in.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
            } finally {
                if (null != in) {
                    in.close();
                }
                if (null != out) {
                    out.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 读取excel模板，并复制到新文件中供写入和下载
     */
    public File createNewFile(String tempPath, String rPath) {
        // 读取模板，并赋值到新文件************************************************************
        // 文件模板路径
        String path = (tempPath);
        File file = new File(path);
        // 保存文件的路径
        String realPath = rPath;
        // 新的文件名
        String newFileName = System.currentTimeMillis() + ".xlsx";
        // 判断路径是否存在
        File dir = new File(realPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        // 写入到新的excel
        File newFile = new File(realPath, newFileName);
        try {
            newFile.createNewFile();
            // 复制模板到新文件
            fileChannelCopy(file, newFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return newFile;
    }

    /**
     * 下载成功后删除
     */
    private void deleteFile(File... files) {
        for (File file : files) {
            if (file.exists()) {
                file.delete();
            }
        }
    }
}