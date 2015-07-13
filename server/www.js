var http = require('http');
var fs = require("fs");
var url = require("url");
var log4js = require("log4js");
var sleep = require("sleep");

http.createServer(
  function(req, res) {
    log4js.loadAppender('file');
    log4js.addAppender(log4js.appenders.file('signup.log'));
    var logger = log4js.getLogger();

    var params = url.parse(req.url, true).query;
    var dateParam = params.date;

    if (dateParam === undefined) {
      res.write("Date not requested...");
    }
    else {
      var BuildExcelSignup = require("./parseSignupExcelBuilder.js");
      var builder = new BuildExcelSignup(dateParam);
      sleep.sleep(2);
      var fileName = "prasignups" + dateParam + ".xlsx";
      logger.debug("retrieving file for " + fileName);
      if (fs.exists(fileName)) {
        var fileContext = fs.readFileSync(fileName);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        res.end(fileContext);
        // now that the file was sent to the browser, remove it.  That way, these don't hang around.
        fs.unlink(fileName);
      }
      else {
        logger.error("User requested " + dateParam + " but that does not exist.");
        res.write(dateParam + " is not a valid signup sheet date...");
      }
    }

    res.end(JSON.stringify(params));
  }
).listen(process.env.PORT, process.env.IP);