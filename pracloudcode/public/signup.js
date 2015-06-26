function initSignupForm() {
    Parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

    Parse.Cloud.run("listEvents", {}, {
        success: function (results) {
            var listItems = buildOptionFromParse("", "Select a date");
            var today = new Date();
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var eventDate = object.get("eventDate");
                var dateString = eventDate.getMonth() + 1 + "-" + eventDate.getDate() + "-" + eventDate.getFullYear();
                var eventDate = new Date(dateString);
                if (eventDate > today) {
                    listItems += buildOptionFromParse(dateString, dateString);
                }
            }

            $("#date").html(listItems);
        },
        error: function (error) {
        }
    });
    window.fbAsyncInit = function () {
        Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId: '1574130206174062', // Facebook App ID
            status: false,  // check Facebook Login status
            cookie: true,  // enable cookies to allow Parse to access the session
            xfbml: true,  // initialize Facebook social plugins on the page
            version: 'v2.2' // point to the latest Facebook Graph API version
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}

function buildOptionFromParse(value, label) {
    return "<option value='" + value + "'>" + label + "</option>";
}

function handleSubmit(form) {
    var data = {};
    //Gathering the Data
    //and removing undefined keys(buttons)
    $.each(form.elements, function (i, v) {
        var input = $(v);
        data[input.attr("name")] = input.val();
        delete data["undefined"];
    });
    var name = data["name"];
    var date = data["date"];
    var job = JSON.parse(data["job"]);
    Parse.Cloud.run("processSignup", 
        { name: name, date: date, job: job }, {
        success: function() {},
        error: function() {}
    });

    var signupAgain = confirm(data["name"] + ", thanks for your help!  Your signup for " + job.job_title + " on " +
                    job.job_day + " on the event weekend of " + data["date"] + " has been recorded.\n\n" +
                    "Click a button and sign up for another job, or close the window to return to the website."
    );

    window.Location.reload(true);
    return false;
}

function populateJobs() {
    // get all the signups for the picked date
    var selectedDateId = $("#date").val();
    $("#job").html("");

    // now get all the jobs for this date, filtering the still available ones (ones that dont' have a signup).
    // Parse doesn't have a "not in" clause query so we have to get creative with this.  Keep an eye out for a
    // not in clause in the future.
    // get the signups for this date
    var signupQuery = new Parse.Query("Signup");
    var signupJobIds = new Array();
    signupQuery.equalTo("event", selectedDateId);
    signupQuery.select("event", "job_id");
    signupQuery.find({
        success: function (signupResults) {
            for (var index = 0; index < signupResults.length; index++) {
                //alert(JSON.stringify(signupResults[index]));
                signupJobIds.push(signupResults[index].get("job_id"));
            }
        }
    });
    //alert(JSON.stringify(signupJobIds));
    //Parse.Cloud.run("listJobs", {event_id: selectedDateId}, {
    var jobQuery = new Parse.Query("Jobs");
    jobQuery.equalTo("reserved", false);
    jobQuery.ascending("sort_order");
    jobQuery.find({
        success: function (results) {
            var listItems = "";
            for (var i = 0; i < results.length; i++) {
                var job = results[i];
                if (signupJobIds.indexOf(job.id) == -1) {
                    listItems += buildOptionFromParse(
                            JSON.stringify(job), job.get("job_title")
                    );
                }
            }

            $("#job").html(listItems);
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function fbLogin() {
    // Run code after the Facebook SDK is loaded.
    Parse.FacebookUtils.logIn(null, {
        success: function (user) {

            FB.api('/me', function (response) {
                document.getElementById("name").value = response.name;
                document.getElementById("name").disabled = true;
                document.getElementById("fb-login").disabled = true;
            });
            if (!user.existed()) {
                console.log("User signed up and logged in through Facebook!");
            } else {
                console.log("User logged in through Facebook!");
            }
        },
        error: function (user, error) {
            alert("No problem, you can still sign up by typing in your name!");
        }
    });
    return false;
}

function getHistory() {
    var name = document.getElementById("name").value;
    var signupQuery = new Parse.Query("Signup");
    signupQuery.equalTo("name", name);
    signupQuery.find({
        success: function(results) {
            console.log(JSON.stringify(results));
            appendToHistory("<ul>");
            for (var index = 0; index < results.length; index++) {
                var signup = results[index];
                var name = signup.get("name");
                var event = signup.get("event");
                var job = signup.get("job_title");
                var points = signup.get("point_value");
                appendToHistory("<li>"+name+" held the job of <b>"+job+ "</b> ("+points+" points) for the event on " + event + "</li>");
            }
            appendToHistory("<ul>");
        }
    });
}

function appendToHistory(value) {
    document.getElementById("history").innerHTML += value;
}
