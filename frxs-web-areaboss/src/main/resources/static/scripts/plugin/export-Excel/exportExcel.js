function saveExcel(jsonObj, colNameMap, fileName) {
    if (!jsonObj || !colNameMap)return;
    if (!fileName)fileName = 'ExportExcel' + new Date().getTime();

    var excel = '<table border="1">';
    excel += '<tr>';
    $.each(colNameMap, function (key, value) {
        excel += '<td style="mso-number-format:\'\@\';"><h4>' + value + '</h4></td>';
    });
    excel += '</tr>';

    $.each(jsonObj, function (i, item) {
        excel += '<tr>';
        $.each(colNameMap, function (key, value) {
            if(key != 'payeeCode' && key != 'payerCode' && key != 'storeNo' && key != 'storeCode' && key != 'vendorCode' && key != 'sku' && isNumber(String(item[key]))&&String(item[key]).length < 11){
                excel += '<td style="mso-number-format:"/#/,/#/#0/.00_ /;/[Red/]/-/#/,/#/#0/.00/"">' +(item[key] == undefined ? '' : item[key])  + '</td>';
            }else {
                excel += '<td style="mso-number-format:\'\@\';">' + (item[key] == undefined ? '' : item[key]) + '</td>';
            }
        });
        excel += '</tr>';
    });
    excel += '</table>';

    var excelFile = '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    excelFile += '<head>';
    excelFile += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
    excelFile += '<xml>';
    excelFile += '<x:ExcelWorkbook>';
    excelFile += '<x:ExcelWorksheets>';
    excelFile += '<x:ExcelWorksheet>';
    excelFile += '<x:Name>';
    excelFile += fileName;
    excelFile += '</x:Name>';
    excelFile += '<x:WorksheetOptions>';
    excelFile += '<x:ProtectContents>False</x:ProtectContents>';
    excelFile += '<x:ProtectObjects>False</x:ProtectObjects>';
    excelFile += '<x:ProtectScenarios>False</x:ProtectScenarios>';
    excelFile += '</x:WorksheetOptions>';
    excelFile += '</x:ExcelWorksheet>';
    excelFile += '</x:ExcelWorksheets>';
    excelFile += '</x:ExcelWorkbook>';
    excelFile += '</xml>';
    excelFile += '</head>';
    excelFile += '<body>';
    excelFile += excel;
    excelFile += '</body>';
    excelFile += '</html>';

    saveAs(
        new Blob(['\ufeff' + excelFile], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf8'}),
        fileName + '.xls'
    );

    // window.open('data:application/vnd.ms-excel;charset=UTF-8;US-ASCII,' + excelFile);
}

function isNumber(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}