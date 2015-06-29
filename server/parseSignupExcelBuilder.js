"use strict";

function BuildExcelSignup(signupDate) {

    this.initParse();

    var signUpWithName = this.findExistingSignups(signupDate);

    // find all the jobs 
    var jobsQuery = new this.parse.Query("Jobs");
    jobsQuery.limit(250);
    jobsQuery.ascending("sort_order");
    var be = this;
    jobsQuery.find({
        success: function(results) {
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
                // now check to see if the job is reserved, and if so, bold the row
                // excel uses 1 based indeces, so add 2 to the row number to find
                // the actual row

                // apply styles to the row.  If the job is reserved, then bold the font
                be.applyRowStyles(sheet.lastRow, index, signup.reserved);
            }

            workbook.xlsx.writeFile("prasignups.xlsx")
                .then(function() {
                    // done
                });
            //console.log(signups.length);
        }
    });
}
BuildExcelSignup.prototype.initParse = function() {
    this.parse = require('parse').Parse;
    this.parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");
}

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
    signupQuery.find({
        success: function(signupResults) {
            for (var index = 0; index < signupResults.length; index++) {
                //alert(JSON.stringify(signupResults[index]));
                var signup = signupResults[index];
                var jobId = signup.get("job_id");
                signUpWithName[jobId] = signup.get("name");
            }
        }
    });
    return signUpWithName;
}

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

BuildExcelSignup.prototype.applyRowStyles = function(row, rowNumber, isBold) {
    row.font = {
        bold: isBold
    };

    row.border = {
        top: {
            style: "thin"
        },
        left: {
            style: "thin"
        },
        bottom: {
            style: "thin"
        },
        right: {
            style: "thin"
        }
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