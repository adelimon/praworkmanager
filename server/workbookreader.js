var Excel = require("exceljs");
var Parse = require("parse");

var WorkbookReader = module.exports = function(filename) {
    var parse = require('parse').Parse;
    parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function() {
            var worksheet = workbook.getWorksheet(1);
            worksheet.eachRow(function(row, rowNumber) {
                if (rowNumber > 1) {
                    var incomingName = row.values[1];
                    var job = row.values[2];
                    var id = row.values[7];
                    var isUpdate = (id.length > 0);
                    var isNew = ((id.length == 0) && (incomingName.length > 0));
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
                                } else {
                                    console.log("No update for " + incomingName + "/" + job + " as it is unchanged.")
                                }
                            }
                        );
                    }
                    if (isNew) {
                        console.log("New: " + incomingName + " == " + job + id);
                        
                    }
                    
                }
            });
        }
    );

}

var reader = new WorkbookReader("prasignups6-7-2015.xlsx");