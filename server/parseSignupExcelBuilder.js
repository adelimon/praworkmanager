"use strict";

/**
 * Represents an excel signup sheet that can be built from Parse data.
 * @class
 * @constructor
 * @requires module:parse
 * @param {string} signup date to get data for.
 */
var BuildExcelSignup = module.exports = function(signupDate) {
    var file = "prasignups"+signupDate+".xlsx";
    this.fileName = file;
    this.initParse();
    
    var signUpWithName = this.findExistingSignups(signupDate);

    // find all the jobs 
    var jobsQuery = new this.parse.Query("Jobs");
    jobsQuery.limit(250);
    jobsQuery.ascending("sort_order");
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
            var SignupWorkbook = require("./signupworkbook");
            var workbook = new SignupWorkbook(signups, file);
        }
    );
}

BuildExcelSignup.prototype = {
    /**
     * Initialize the connection to Parse, so that it can be used throughout the class.
     * @returns void
     */
    initParse: function() {
        this.parse = require('parse').Parse;
        this.parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");
    },

    /**
     * Find the existing signups for a given date.  This returns an array of
     * jobid -> name pairings.  Note this function will pick up both reserved 
     * signups (typically set for the year), as well as signups entered online
     * or by the admin.
     * @param {string} signupDate date for the signups
     * @returns {Array} an associative array of signup ids to names.
     */
    findExistingSignups: function(signupDate) {
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
}