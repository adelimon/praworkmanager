var Excel = require("exceljs");

var workbook = new Excel.Workbook();
workbook.creator = "PRA work manager system";
workbook.lastModifiedBy = workbook.creator;
workbook.created = new Date();
workbook.modified = new Date();

var sheet = workbook.addWorksheet("Signups");
sheet.columns = [
    { header: "Name", key: "name", width: 10 },
    { header: "Job Title", key: "title", width: 32 },
    { header: "Points", key: "points", width: 10 },
    { header: "Cash", key: "cash", width: 10 },
    { header: "Paid", key: "job_day", width: 10 },
    { header: "Points", key: "job_day", width: 10 },
    { header: "Meal Ticket", key: "job_day", width: 10 },
    { header: "Signature", key: "job_day", width: 30 }
];


workbook.xlsx.writeFile("prasignups.xlsx")
    .then(function() {
        // done
    });