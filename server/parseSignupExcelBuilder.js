"use strict";

/**
 * Represents an excel signup sheet that can be built from Parse data.
 * @class
 * @constructor
 * @requires module:parse
 * @requires module:exceljs
 * @param {string} signup date to get data for.
 */
function BuildExcelSignup(signupDate) {

    this.initParse();

    var signUpWithName = this.findExistingSignups(signupDate);

    // find all the jobs 
    var jobsQuery = new this.parse.Query("Jobs");
    jobsQuery.limit(250);
    jobsQuery.ascending("sort_order");
    // abstract trick to reference the outer scope from the inner scope.
    // ugly but fnctional!
    var be = this;
    jobsQuery.find().then(
        function(results) {
            var signups = new Array();
            for (var index = 0; index < results.length; index++) {
                var job = results[index];
                var signupName = signUpWithName[job.id];
                if (signupName == undefined) {
                    signupName = "";
                }
                signups.push({
                    name: signupName,
                    title: job.get("job_title"),
                    points: job.get("point_value"),
                    cash: job.get("cash_value"),
                    job_day: job.get("job_day"),
                    reserved: job.get("reserved")
                });
            }
            // now taht we have all sign ups, build a worksheet in Excel.
            // reference the workbook here, becuase we need to call it to save
            // the file to disk.
            var workbook = be.buildworkbook();
            var sheet = workbook.getWorksheet(1);
            // put the data in the sheet
            for (var index in signups) {
                var signup = signups[index];
                console.log(JSON.stringify(signups[index]));
                var row = [];
                row.push(signup.name);
                row.push(signup.title);
                row.push(signup.points);
                row.push(signup.cash);
                row.push("Pd / Pts")
                sheet.addRow(row);

                // apply styles to the row.  If the job is reserved, then bold the font
                be.applyRowStyles(sheet.lastRow, index, signup.reserved);
            }

            workbook.xlsx.writeFile("prasignups.xlsx")
                .then(function() {
                    // done
                });
        });
}
/**
 * Initialize the connection to Parse, so that it can be used throughout the class.
 * @returns void
 */
BuildExcelSignup.prototype.initParse = function() {
    this.parse = require('parse').Parse;
    this.parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");
}

/**
 * Find the existing signups for a given date.  This returns an array of
 * jobid -> name pairings.  Note this function will pick up both reserved 
 * signups (typically set for the year), as well as signups entered online
 * or by the admin.
 * @param {string} signupDate date for the signups
 * @returns {Array} an associative array of signup ids to names.
 */
BuildExcelSignup.prototype.findExistingSignups = function(signupDate) {
    // Get the signups for a given date
    var dateQuery = new this.parse.Query("Signup");
    dateQuery.equalTo("event", signupDate);
    dateQuery.ascending("sort_order");

    var reservedQuery = new this.parse.Query("Signup");
    reservedQuery.equalTo("reserved", true);

    var signupQuery = new this.parse.Query.or(dateQuery, reservedQuery);

    // store a map of names to job ids for the given date, then use them to fill in the signups as appropriate.
    var signUpWithName = new Array();
    signupQuery.find().then(
        function(signupResults) {
            for (var index = 0; index < signupResults.length; index++) {
                var signup = signupResults[index];
                var jobId = signup.get("job_id");
                signUpWithName[jobId] = signup.get("name");
            }
        }
    );
    return signUpWithName;
}

/**
 * Build an excel workbook with fields pre-filled in the header. 
 * @returns {Workbook} an excel workbook object from the exceljs package.
 */
BuildExcelSignup.prototype.buildworkbook = function() {
    var Excel = require("exceljs");

    var workbook = new Excel.Workbook();
    workbook.creator = "PRA work manager system";
    workbook.lastModifiedBy = workbook.creator;
    workbook.created = new Date();
    workbook.modified = new Date();

    var sheet = workbook.addWorksheet("Signups");
    sheet.columns = [{
        header: "Name",
        width: 17
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
    }];
    return workbook;
}

/**
 * Apply styles to the row.  This will apply a static style to each row.
 * @param {Row} row a row of a worksheet from the ExcelJS package.
 * @param {int} rowNumber the row number.
 * @param {boolean} whether or not the row should be bolded. This is TYPICALLY
 *  based on data in the row but can be whatever you want.
 * @returns void
 */
BuildExcelSignup.prototype.applyRowStyles = function(row, rowNumber, isBold) {
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

var b = new BuildExcelSignup("6-7-2015");