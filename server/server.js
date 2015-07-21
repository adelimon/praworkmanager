var express = require('express');
var fs = require("fs");


var app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');

});

app.use(express.static('../html'));

app.get('/signup/:date', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var dateParam = req.params.date;
    if (dateParam === undefined) {
        res.send("Date not requested...");
    }
    else {
        var BuildExcelSignup = require("./parseSignupExcelBuilder.js");
        var builder = new BuildExcelSignup(dateParam);
        res.send('<a href="/latest">Download sheet</a>');
    }
});


app.get('/latest', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var dir = "./";
    var files = fs.readdirSync(dir);
    files.sort(function(a, b) {
        return fs.statSync(dir + b).mtime.getTime() -
            fs.statSync(dir + a).mtime.getTime();
    });
    var latestXlsFileName = "";
    for (var index = 0; index < files.length; index++) {
        if (files[index].indexOf("xlsx") > -1) {
            latestXlsFileName = files[index];
        }
    }
    var fileContents = fs.readFileSync(latestXlsFileName);
    res.setHeader('Content-disposition', 'attachment; filename=' + latestXlsFileName);
    res.send(fileContents);
    fs.unlinkSync(latestXlsFileName);
});


var server = app.listen(process.env.PORT, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});