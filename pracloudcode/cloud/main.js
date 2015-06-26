/**
 * Trigger after a signup is entered - send an email.  Do this in cloud code
 * rather than on the client, because that's where it belongs.
 */
Parse.Cloud.afterSave("Signup",
    function(request) {
        var name = request.object.get("name");
        var jobTitle = request.object.get("job_title");
        var event = request.object.get("event");


        var Mailgun = require("mailgun");
        Mailgun.initialize('sandboxd12b57cf73ce4b56ad3a175e89c5c8e1.mailgun.org', 'key-6d3648873bf6a19a939569cdda457c66');

        var msgSubject = name + " signed up for " + jobTitle + " on " + event;
        Mailgun.sendEmail({
            to: "adelimon@gmail.com, hogbacksecretary@gmail.com, dlstone727@yahoo.com",
            from: "signup@palmyramx.com",
            subject: msgSubject,
            text: msgSubject + ". Please see the signup sheet for details."
        }, {
            success: function(httpResponse) {
                console.log(httpResponse);
                httpResponse.success("Email sent!");
            },
            error: function(httpResponse) {
                console.error(httpResponse);
                httpResponse.error("Uh oh, something went wrong");
            }
        });
    }
);

/**
 * List the events associated with a given calendar year.
 * @return a list of the results, sorted in ascending order.
 */
Parse.Cloud.define("listEvents",
    function(request, response) {
        var eventQuery = new Parse.Query("ScheduleDates");
        eventQuery.ascending("eventDate");
        eventQuery.find({
            success: function(results) {
                response.success(results);
            }
        });
    }
);

/**
 * Get the next event that we have coming up.
 * @return the next event's date object.
 */
Parse.Cloud.define("getNextEvent",
    function(request, response) {
        var eventQuery = new Parse.Query("ScheduleDates");
        var moment = require("moment");
        eventQuery.ascending("eventDate");
        eventQuery.find({
            success: function(results) {
                var dateArray = [];
                var now = new Date();
                var nextDate;
                for (var index = 0; index < results.length; index++) {
                    var date = results[index].get("eventDate");
                    if (date.getTime() > now.getTime()) {
                        nextDate = moment(date).format("M-D-YYYY");
                        break;
                    }
                }
                response.success(nextDate);
            }
        });
    }
);


/**
 * Process an event signup.
 * @param request.params.job - JSON object representing the job the useris signing up for.
 * @param request.params.name - The name of the person signing up.
 * @param request.params.date - the event data
 */
Parse.Cloud.define("processSignup",
    function(request, response) {
        var job = request.params.job;
        var name = request.params.name;
        var date = request.params.date;
        var Signup = Parse.Object.extend("Signup");
        var savedSignup = new Signup();
        savedSignup.set("name", name);
        savedSignup.set("event", date);
        savedSignup.set("job_title", job.job_title);
        savedSignup.set("job_day", job.job_day);
        savedSignup.set("point_value", job.point_value);
        savedSignup.set("cash_value", job.cash_value);
        savedSignup.set("meal_ticket", job.meal_ticket);
        savedSignup.set("sort_order", job.sort_order);
        savedSignup.set("job_day", job.job_day);
        savedSignup.set("job_id", job.objectId);
        savedSignup.save(null, {
            success: function(savedSignup) {
                // Execute any logic that should take place after the object is saved.
                response.success('New object created with objectId: ' + savedSignup.id);
                console.log(JSON.stringify(savedSignup));
            },
            error: function(savedSignup, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("errored for signup " + JSON.stringify(job));
                response.error('Failed to create new object, with error code: ' + error.message);
            }
        });
    }
);


Parse.Cloud.define(
    "listSignupsForDate",
    function(request, response) {
        var signupDate = request.params.signupDate;
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
                response.signups = signups;
                //console.log(signups.length);
            }
        });

    }
);

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});