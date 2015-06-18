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
 * Process an event signup.
 * @param request.params.job - JSON object representing the job the useris signing up for.
 * @param request.params.name - The name of the person signing up.
 * @param request.params.date - the event date.
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

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});
