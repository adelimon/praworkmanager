/**
 * A workbook object, built from ExcelJs, with some headers pre-filled.
 * @class
 * @constructor
 * @param {array} signupList An array of objects with signup information on them.  It is
 * assumed to have properties with names, check the code for the names. 
 * @param {string} fileName the name of the file to write.
 * @requires module:exceljs
 */
var SignupWorkbook = module.exports = function(signupList, fileName, date) {
    var Excel = require("exceljs");
    this.workbook = new Excel.Workbook();
    this.workbook.creator = "PRA work manager system";
    this.workbook.lastModifiedBy = this.workbook.creator;
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.signups = signupList;
    this.eventDate = date;
    this.file = fileName;
    var sheet = this.workbook.addWorksheet("Signups");
    sheet.columns = [{
        header: "Name",
        width: 17,
    }, {
        header: "Job Title",
        width: 32
    }, {
        header: "Points",
        width: 10
    }, {
        header: "Cash",
        width: 10,
        style: {
            numFmt: "$0.00"
        }
    }, {
        header: "Paid/Points",
        width: 10
    }, {
        header: "Signature",
        width: 42
    }, {
        // this is a "system" column to make uploads easier.  It does not 
        // print, but is still readable in uploads since it's hidden. 
        header: "parseId", 
        width: 0
    }, {
        // same as above :)
        header: "jobId", 
        width: 0
    }, {
        // me three
        header: "eventDate", 
        width: 0
    }];
    this.addSignups();
    
    this.writeWorkbook();
}
SignupWorkbook.prototype = {

    addSignups: function() {
        var sheet = this.getWorksheet();
        // put the data in the sheet
        for (var index in this.signups) {
            var signup = this.signups[index];
            console.log(JSON.stringify(signup));
            var row = [];
            row.push(signup.name);
            row.push(signup.title);
            row.push(signup.points);
            row.push(signup.cash);
            row.push("Pd / Pts");
            row.push("");
            row.push(signup.parseId);
            row.push(signup.jobId);
            row.push(signup.eventDate);
            sheet.addRow(row);
            // apply styles to the row.  If the job is reserved, then bold the font
            this.applyRowStyles(sheet.lastRow, index, signup.reserved);
        }
        this.addEventDate();
        this.writeWorkbook();
    },

    addEventDate: function() {
        var sheet = this.getWorksheet();
        // add a row with a height of zero to "hide" the event date.  This is 
        // important system level information to an uploaded sheet, but it means
        // jack shit to an editor or printer of this sheet :)
        var row = [];
        row.push(this.eventDate);
        sheet.addRow(row);
        // YOU CAN'T SEE ME! But i'm here, like a creepy Unkle
        sheet.lastRow.height = 0;
    },
    
    getWorksheet: function() {
        return this.workbook.getWorksheet(1);
    },

    writeWorkbook: function() {

        this.workbook.xlsx.writeFile(this.file)
            .then(function() {
                // done
            });
    },

    /**
     * Apply styles to the row.  This will apply a static style to each row.
     * @param {Row} row a row of a worksheet from the ExcelJS package.
     * @param {int} rowNumber the row number.
     * @param {boolean} whether or not the row should be bolded. This is TYPICALLY
     *  based on data in the row but can be whatever you want.
     * @returns void
     */
    applyRowStyles: function(row, rowNumber, isBold) {
        row.font = {
            bold: isBold
        };
        var borderStyle = {
            style: "thin"
        };
        row.border = {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle
        };
        row.height = 25;
        if (rowNumber % 2) {
            row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "e5e5e5"
                }
            };
        }
    }

}