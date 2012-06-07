// node.js (for Heroku). Simply serve the HTML

var util = require('util'),
    express = require('express'),
    http = require('http'),
    fs = require('fs'),
    index;
             
fs.readFile('./index.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});


http.createServer(function(request, response) {
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(index);
    response.close();
}).listen(process.env.PORT);


app.listen(process.env.PORT);
