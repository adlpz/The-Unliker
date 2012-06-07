// node.js (for Heroku). Simply serve the HTML

var sys = require('sys'),
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
    express.logger(),
    express.static(__dirrname + '/static'),
    express.bodyParser(),
    express.cookieParser(),
    express.session({ secret: process.env.SESSION_SECRET || "lolmysecret" }),
    require('faceplate').middleware({
        app_id: process.env.FACEBOOK_APP_ID,
        secret: process.env.FACEBOOK_SECRET,
        scope: 'user_likes,user_interests,user_activities'
    })
};

app.listen(process.env.PORT);
