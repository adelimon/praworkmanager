var Excel = require("exceljs");
var Parse = require("parse");

var WorkbookReader = module.exports = function(filename) {
    var parse = require('parse').Parse;
    parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function() {
            var worksheet = workbook.getWorksheet(1);
            var lastRow = worksheet.lastRow;
            var signupDate = lastRow.values[1];
            console.log(signupDate);
            worksheet.eachRow(function(row, rowNumber) {
                if ((rowNumber > 1) && (row !== worksheet.lastRow)) {
                    var incomingName = row.values[1];
                    var jobTitle = row.values[2];
                    var id = row.values[7];
                    var jobId = row.values[8];
                    var noId = (id === undefined);
                    var isUpdate = ((!noId && (id.length > 0)));
                    var isNew = (((noId) || (id.length == 0)) && (incomingName.length > 0));
                    if (isUpdate) {
                        // if the row has an id, then we are updating it.  So run the 
                        // parse query to get it, then change the name.
                        var signupQuery = new parse.Query("Signup");
                        signupQuery.get(id).then(
                            function(existingSignup) {
                                // only do an update if the name has changed.  This will prevent
                                // bogus, unneeded updates, and is safe since name is all that'll ever change with these
                                if (existingSignup.get("name") !== incomingName) {
                                    existingSignup.set("name", incomingName);
                                    existingSignup.save();
                                }
                                else {
                                    console.log("No update for " + incomingName + "/" + jobTitle + " as it is unchanged.");
                                }
                            }
                        );
                    }
                    if (isNew) {
                        // first look up the job by id to get all the needed information.
                        var jobQuery = new parse.Query("Jobs");
                        jobQuery.get(jobId).then(
                            function(jobInfo) {
                                // now that we have a job, save a signup for it with all the info.
                                var job = {};
                                job.job_title = jobInfo.get("job_title");
                                job.job_day = jobInfo.get("job_day");
                                job.point_value = jobInfo.get("point_value");
                                job.cash_value = jobInfo.get("cash_value");
                                job.meal_ticket = jobInfo.get("meal_ticket");
                                job.sort_order = jobInfo.get("sort_order");
                                job.job_day = jobInfo.get("job_day");
                                job.reserved = jobInfo.get("reserved");
                                job.objectId = jobInfo.id;
                                console.log(incomingName + " " + JSON.stringify(job));
                                // create a Parse object with this name and job title
                                
                                parse.Cloud.run("processSignup", {
                                    name: incomingName,
                                    // TODO need a real date value here.
                                    date: signupDate,
                                    job: job
                                }, {
                                    success: function() {},
                                    error: function() {}
                                });
                                
                            }
                        );
                    }

                }
            });
        });

}

var reader = new WorkbookReader(process.argv[2];