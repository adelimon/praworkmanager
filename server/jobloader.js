var parse = require('parse').Parse;
parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

// this is a hack, but it's for a loader script
// so no big deal.
var GLOBAL_SORT_ORDER = 0;

function buildJob(title, count, points, leader) {
    var Jobs = parse.Object.extend("Jobs");
    
    for (var index = 0; index < count; index++) {
        var job = new Jobs();
        job.set("job_title", title);
        job.set("point_value", points);
        job.set("leader_email", leader);
        job.set("sort_order", GLOBAL_SORT_ORDER);
        job.set("job_type", "WORKDAY");
        job.set("job_day", "Any");
        job.set("reserved", false);
        job.save();
        GLOBAL_SORT_ORDER++;
    }
}

buildJob("Fence Work (Pee Wee Track/Hill Top", 4, 2, "adamn@pikeco.com");
buildJob("Carpentry (Spectator Fence, Dog House, Shed door)", 3, 2, "mxdad7876@yahoo.com");
buildJob("Seeding and tower cleanup", 2, 1, "ags72@yahoo.com");
buildJob("Clean/organize equipment shed", 2, 2, "rrugaber@rochester.rr.com");
buildJob("Power equipment - test/maint/document", 2, 1, "rrugaber@rochester.rr.com");
buildJob("Starting Gates Maintenance", 2, 1, "rrugaber@rochester.rr.com");