var SignupSheet = function() {
    Parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");
}

SignupSheet.prototype.loadSignups = function() {

    var dateQuery = new Parse.Query("Signup");
    dateQuery.equalTo("event", "5-10-2015");
    dateQuery.ascending("sort_order");

    var reservedQuery = new Parse.Query("Signup");
    reservedQuery.equalTo("reserved", true);

    var signupQuery = new Parse.Query.or(dateQuery, reservedQuery);

    // store a map of names to job ids for the given date, then use them to fill in the signups as appropriate.
    var signUpWithName = new Array();
    signupQuery.find({
        success: function (signupResults) {
            //alert(JSON.stringify(signupResults));
            for (var index = 0; index < signupResults.length; index++) {
                //alert(JSON.stringify(signupResults[index]));
                var signup = signupResults[index];
                signUpWithName[signup.get("job_id")] = signup.get("name");
            }
        }
    });

    var jobsQuery = new Parse.Query("Jobs");
    jobsQuery.limit(250);
    jobsQuery.ascending("sort_order");
    jobsQuery.find({
        success: function (results) {
            //alert(JSON.stringify(results));
            //var x = document.getElementById("myTable").rows[0].cells;
            var rows = document.getElementById("myTable").rows;
            for (var index = 0; index < results.length; index++) {
                var job = results[index];
                var row = rows[index + 1];
                var reserved = job.get("reserved");
                var signupName = signUpWithName[job.id];
                if (signupName == undefined) {
                    signupName = "";
                }
                row.cells[0].innerHTML = signupName;
                var job_title = job.get("job_title");
                if (reserved) {
                    job_title = "<b>" + job_title + "</b>";
                }
                row.cells[1].innerHTML = job_title;
                row.cells[2].innerHTML = job.get("point_value");
                row.cells[3].innerHTML = job.get("cash_value");
                row.cells[4].innerHTML = job.get("job_day");
                row.cells[5].innerHTML = "";
                row.cells[6].innerHTML = "";
                row.cells[7].innerHTML = "";
                row.cells[8].innerHTML = "";

            }
        }
    });
}