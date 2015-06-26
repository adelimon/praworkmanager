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
        console.log(JSON.stringify(signups));
        //console.log(signups.length);
    }
});