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

app.get('/', function(req, res) {
    res.send(index);
}

app.listen(process.env.PORT);
