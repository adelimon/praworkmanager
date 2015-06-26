"use strict";

var Parse = require('parse').Parse;

Parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");
var signupDate = "6-7-2015";

// Get the signups for a given date
var dateQuery = new Parse.Query("Signup");
dateQuery.equalTo("event", signupDate);
dateQuery.ascending("sort_order");

var reservedQuery = new Parse.Query("Signup");
reservedQuery.equalTo("reserved", true);

var signupQuery = new Parse.Query.or(dateQuery, reservedQuery);

// store a map of names to job ids for the given date, then use them to fill in the signups as appropriate.
var signUpWithName = new Array();
var signupDates = new Array();
signupQuery.find({
    success: function(signupResults) {
        for (var index = 0; index < signupResults.length; index++) {
            //alert(JSON.stringify(signupResults[index]));
            var signup = signupResults[index];
            var jobId = signup.get("job_id");
            signUpWithName[jobId] = signup.get("name");
            signupDates[jobId] = signup.createdAt;
        }
    }
});

var signupList = new Array();

// find all the jobs 
var jobsQuery = new Parse.Query("Jobs");
jobsQuery.limit(250);
jobsQuery.ascending("sort_order");
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
            style: { numFmt: "$0.00"}
        }, {
            header: "Paid/Points",
            width: 10
        }, {
            header: "Signature",
            width: 42
        }];
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
            if (signup.reserved) {
                sheet.lastRow.font = { bold:true };
            }
            sheet.lastRow.border = {
                top: {style:"thin"},
                left: {style:"thin"},
                bottom: {style:"thin"},
                right: {style:"thin"}
            };
            sheet.lastRow.height = 25;
            if (index % 2) {
                sheet.lastRow.fill = {
                    type: "pattern",
                    pattern:"solid",
                    fgColor:{argb:"e5e5e5"}
                };
            }
        }

        workbook.xlsx.writeFile("prasignups.xlsx")
            .then(function() {
                // done
            });
        //console.log(signups.length);
    }
});