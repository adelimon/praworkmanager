var Excel = require("exceljs");
var Parse = require("parse");

var WorkbookReader = module.exports = function(filename) {
    this.parse = require('parse').Parse;
    this.parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function() {

            var worksheet = workbook.getWorksheet(1);
            worksheet.eachRow(function(row, rowNumber) {
                if (rowNumber > 1) {
                    var name = row.values[1];
                    var job = row.values[2];
                    var id = row.values[7];
                    if (name.length > 0) {
                        console.log(name + " == " + job + id);
                    }
                }

            });
        });

}

var reader = new WorkbookReader("prasignups6-7-2015.xlsx");