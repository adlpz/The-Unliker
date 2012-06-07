// node.js (for Heroku). Simply serve the HTML

var util = require('util'),
    express = require('express'),
    fs = require('fs'),
    index;
             
fs.readFile('./index.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});

var app = express.createServer(
    express.static(__dirname + '/static')
);

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/', function(req, res) {
    res.header("Content-Type", "text/html");
    res.send(index);
    res.end();
});

