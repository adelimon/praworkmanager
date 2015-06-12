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
                response.success("Email sent!");
            },
            error: function(httpResponse) {
                console.error(httpResponse);
                response.error("Uh oh, something went wrong");
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

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});
