var http = require('http');
var fs = require("fs");
var url = require("url");

http.createServer(
  function(req, res) {

    var params = url.parse(req.url, true).query;
    var dateParam = params.date;

    if (dateParam === undefined) {
      res.write("Date not requested...");
    }
    else {
        var fileName = "prasignups" + dateParam + ".xlsx";
        console.log("retrieving file for " + fileName);
        var fileContext = fs.readFileSync(fileName);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        res.end(fileContext);
    }

    res.end(JSON.stringify(params));
  }
).listen(process.env.PORT, process.env.IP);