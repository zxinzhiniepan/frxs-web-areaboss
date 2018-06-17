//package com.frxs.web.areaboss.utils;
//
//import com.frxs.framework.util.common.log4j.LogUtil;
//import javax.annotation.PostConstruct;
//import javax.servlet.http.HttpServletResponse;
//import org.springframework.stereotype.Component;
//
///**
// * @author fygu
// * @version $Id: ExcelExportUtil.java,v 0.1 2018年04月11日 11:51 $Exp
// */
//@Component
//public class ExcelExportUtil {
//
//
//    private final static Integer MAX_EXPORT_NUM= 65536;
//
//    private static ExcelExportUtil excelExportUtil;
//
//    @PostConstruct
//    public void init() {
//        excelExportUtil = this;
//    }
//
//
//
//
//    public void toExcel(List<FullProcess> list, HttpServletRequest request,
//        int length, String f, OutputStream out) throws IOException {
//        List<String> fileNames = new ArrayList(); // 用于存放生成的文件名称s
//        String path = Env.getProperty(Env.FILE_UPLOAD_URL);
//        File zip = new File(path + "excel/"  + f + ".zip"); // 压缩文件
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
//        // 生成excel
//        for (int j = 0, n = list.size() / length + 1; j < n; j++) {
//            Workbook book = new HSSFWorkbook();
//            Sheet sheet = book.createSheet("全流程报表");
//            // double d = 0; // 用来统计
//            String file = path + "excel/" + f + "-" + j
//                + ".xls";
//            fileNames.add(file);
//            FileOutputStream o = null;
//            try {
//                o = new FileOutputStream(file);
//
//                // sheet.addMergedRegion(new
//                // CellRangeAddress(list.size()+1,0,list.size()+5,6));
//                Row row = sheet.createRow(0);
//                row.createCell(0).setCellValue("需求单据号");
//                row.createCell(1).setCellValue("需求人");
//                row.createCell(2).setCellValue("需求日期");
//                row.createCell(3).setCellValue("需求部门");
//                row.createCell(4).setCellValue("是否有立项报告");
//                row.createCell(5).setCellValue("项目名称");
//                row.createCell(6).setCellValue("立项金额");
//                row.createCell(7).setCellValue("收益核算方式");
//                row.createCell(8).setCellValue("年收益金额");
//                row.createCell(9).setCellValue("投资回收期");
//                row.createCell(10).setCellValue("项目类别");
//                row.createCell(11).setCellValue("需求数量");
//                row.createCell(12).setCellValue("需求金额");
//                row.createCell(13).setCellValue("需求审批状态");
//
//                row.createCell(14).setCellValue("采购申请单号");
//                row.createCell(15).setCellValue("采购申请人");
//                row.createCell(16).setCellValue("采购申请日期");
//                row.createCell(17).setCellValue("采购申请数量");
//                row.createCell(18).setCellValue("采购申请金额");
//                row.createCell(19).setCellValue("采购申请审批状态");
//
//                row.createCell(20).setCellValue("订单单据号");
//                row.createCell(21).setCellValue("SAP订单号");
//                row.createCell(22).setCellValue("供应商");
//                row.createCell(23).setCellValue("币种");
//                row.createCell(24).setCellValue("税率");
//                row.createCell(25).setCellValue("订单申请人");
//                row.createCell(26).setCellValue("订单申请日期");
//                row.createCell(27).setCellValue("订单数量");
//                row.createCell(28).setCellValue("订单金额");
//                row.createCell(29).setCellValue("订单审批状态");
//                row.createCell(30).setCellValue("收货单据号");
//                row.createCell(31).setCellValue("收货数量");
//                row.createCell(32).setCellValue("收货日期");
//                row.createCell(33).setCellValue("验收单号");
//                row.createCell(34).setCellValue("验收数量");
//                row.createCell(35).setCellValue("验收状态");
//                row.createCell(36).setCellValue("验收日期");
//                row.createCell(37).setCellValue("验收人");
//                row.createCell(38).setCellValue("物料凭证号");
//                int m = 1;
//                for (int i = 1, min = (list.size() - j * length + 1) > (length + 1) ? (length + 1)
//                    : (list.size() - j * length + 1); i < min; i++) {
//                    m++;
//                    FullProcess user = list.get(length * j + i - 1);
//                    //Double dd = user.getMoney();
//                /*if (dd == null) {
//                    dd = 0.0;
//                }
//                d += dd;*/
//                    Row row1 = sheet.createRow(i);
//                    row1.createCell(0).setCellValue(user.getDoId() == null ? "" : user.getDoId().toString());
//                    row1.createCell(1).setCellValue(user.getDoApplyUser() == null ? "" : user.getDoApplyUser());
//                    row1.createCell(2).setCellValue(user.getDoApplyDate() == null ? "" : sdf.format(user.getDoApplyDate()));
//                    row1.createCell(3).setCellValue(user.getDoApplyDepartment() == null ? "" : user.getDoApplyDepartment());
//                    row1.createCell(4).setCellValue(user.getProjectProposal() == null ? "" : user.getProjectProposal());
//                    row1.createCell(5).setCellValue(user.getEntryName() == null ? "" : user.getEntryName());
//                    row1.createCell(6).setCellValue(user.getProjectMoney() == null ? "" : user.getProjectMoney().toString());
//                    row1.createCell(7).setCellValue(user.getIncomeAccountingMethod() == null ? "" : user.getIncomeAccountingMethod());
//                    row1.createCell(8).setCellValue(user.getAnnualIncomeAmount() == null ? "" : user.getAnnualIncomeAmount().toString());
//                    row1.createCell(9).setCellValue(user.getPaybackPeriodOfInvestment() == null ? "" : user.getPaybackPeriodOfInvestment());
//                    row1.createCell(10).setCellValue(user.getProjectType() == null ? "" : user.getProjectType());
//                    row1.createCell(11).setCellValue(user.getDoDemandCount() == null ? "" : user.getDoDemandCount().toString());
//                    row1.createCell(12).setCellValue(user.getDoIamoney() == null ? "" : user.getDoIamoney().toString());
//                    row1.createCell(13).setCellValue(user.getDoCapprovalstate() == null ? "" : user.getDoCapprovalstate());
//                    row1.createCell(14).setCellValue(user.getAoId() == null ? "" : user.getAoId());
//                    row1.createCell(15).setCellValue(user.getAoApplyUser() == null ? "" : user.getAoApplyUser());
//                    row1.createCell(16).setCellValue(user.getAoApplyDate() == null ? "" :  sdf.format(user.getAoApplyDate()));
//                    row1.createCell(17).setCellValue(user.getApApplyCount() == null ? "" : user.getApApplyCount().toString());
//                    row1.createCell(18).setCellValue(user.getAoIamoney() == null ? "" : user.getAoIamoney().toString());
//                    row1.createCell(19).setCellValue(user.getAoCapprovalstate() == null ? "" : user.getAoCapprovalstate());
//                    row1.createCell(20).setCellValue(user.getPurchaseOrderId() == null ? "" : user.getPurchaseOrderId());
//                    row1.createCell(21).setCellValue(user.getPurchaseOrderSapId() == null ? "" : user.getPurchaseOrderSapId());
//                    row1.createCell(22).setCellValue(user.getSupplierName() == null ? "" : user.getSupplierName());
//                    row1.createCell(23).setCellValue(user.getCurrencyName() == null ? "" : user.getCurrencyName());
//                    row1.createCell(24).setCellValue(user.getTaxRate() == null ? "" : user.getTaxRate());
//                    row1.createCell(25).setCellValue(user.getPoApplyUser() == null ? "" : user.getPoApplyUser());
//                    row1.createCell(26).setCellValue(user.getPoApplyDate() == null ? "" : sdf.format(user.getPoApplyDate()));
//                    row1.createCell(27).setCellValue(user.getPoApplyCount() == null ? "" : user.getPoApplyCount().toString());
//                    row1.createCell(28).setCellValue(user.getPoIamoney() == null ? "" : user.getPoIamoney().toString());
//                    row1.createCell(29).setCellValue(user.getPoCapprovalstate() == null ? "" : user.getPoCapprovalstate());
//                    row1.createCell(30).setCellValue(user.getReceiveGoodsId() == null ? "" : user.getReceiveGoodsId());
//                    row1.createCell(31).setCellValue(user.getReceiveDate() == null ? "" : sdf.format(user.getReceiveDate()));
//                    row1.createCell(32).setCellValue(user.getReceiveGoodsCount() == null ? "" : user.getReceiveGoodsCount().toString());
//                    row1.createCell(33).setCellValue(user.getCheckAcceptId() == null ? "" : user.getCheckAcceptId());
//                    row1.createCell(34).setCellValue(user.getCheckCount() == null ? "" : user.getCheckCount().toString());
//                    row1.createCell(35).setCellValue(user.getCaCapprovalstate() == null ? "" : user.getCaCapprovalstate());
//                    row1.createCell(36).setCellValue(user.getCaCheckDate() == null ? "" : sdf.format(user.getCaCheckDate()));
//                    row1.createCell(37).setCellValue(user.getApplyCheckUserName() == null ? "" : user.getApplyCheckUserName());
//                    row1.createCell(38).setCellValue(user.getEpMaterialdocument() == null ? "" : user.getEpMaterialdocument());
//                }
//           /* CellStyle cellStyle2 = book.createCellStyle();
//            cellStyle2.setAlignment(CellStyle.ALIGN_CENTER);
//            row = sheet.createRow(m);
//            Cell cell0 = row.createCell(0);
//            cell0.setCellValue("Total");
//            cell0.setCellStyle(cellStyle2);
//            Cell cell4 = row.createCell(4);
//            cell4.setCellValue(d);
//            cell4.setCellStyle(cellStyle2);
//            sheet.addMergedRegion(new CellRangeAddress(m, m, 0, 3));*/
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//            try {
//                book.write(o);
//            } catch (Exception ex) {
//                ex.printStackTrace();
//            } finally {
//                o.flush();
//                o.close();
//            }
//        }
//        File []srcfile = new File[fileNames.size()];
//        for (int i = 0, n = fileNames.size(); i < n; i++) {
//            srcfile[i] = new File(fileNames.get(i));
//        }
//        zipFiles(srcfile, zip);
//        FileInputStream inStream = new FileInputStream(zip);
//        byte[] buf = new byte[4096];
//        int readLength;
//        while ((readLength = inStream.read(buf)) != -1) {
//            out.write(buf, 0, readLength);
//        }
//        inStream.close();
//        deleteFile(fileNames, path + "excel/"  + f + ".zip");
//
//    }
//
//
//    private static CellStyle getStyle(Workbook workbook) {
//                CellStyle style = workbook.createCellStyle();// 创建样式对象
//                // 设置对齐方式
//                 style.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);// 水平居中
//                 style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中
//
//              // 设置边框
//                style.setBorderTop(HSSFCellStyle.BORDER_THICK);// 顶部边框粗线
//                style.setTopBorderColor(HSSFColor.RED.index);// 设置为红色
//              style.setBorderBottom(HSSFCellStyle.BORDER_DOUBLE);// 底部边框双线
//               style.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);// 左边边框
//                style.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);// 右边边框
//
//                style.setWrapText(true);// 设置单元格内容是否自动换行
//               // 格式化日期
//                style.setDataFormat(HSSFDataFormat.getBuiltinFormat("m/d/yy h:mm"));
//
//               // 设置单元格字体
//                Font font = workbook.createFont(); // 创建字体对象
//               font.setFontHeightInPoints((short) 14);// 设置字体大小
//                 font.setColor(HSSFColor.RED.index);// 设置字体颜色
//               font.setFontName("宋体");// 设置为宋体字
//               font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 设置粗体
//              style.setFont(font);// 将字体加入到样式对象
//
//                return style;
//       }
//
//    public static void setResponseHeader(HttpServletResponse response,String fileName) {
//        try {
//            response.setContentType("application/octet-stream;charset=UTF-8");
//            response.setHeader("Content-Disposition", "attachment;filename="
//                + java.net.URLEncoder.encode(fileName, "UTF-8")
//                + ".zip");
//            response.addHeader("Pargam", "no-cache");
//            response.addHeader("Cache-Control", "no-cache");
//        } catch (Exception ex) {
//            LogUtil.error("导出失败 {}",ex.getMessage());
//        }
//    }
//}
