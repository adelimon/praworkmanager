var Excel = require("exceljs");

var WorkbookReader = module.exports = function(filename) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function() {
            var worksheet = workbook.getWorksheet(1);

            worksheet.eachRow(function(row, rowNumber) {
                console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
            });
        });


}

var reader = new WorkbookReader("../read.xlsx");