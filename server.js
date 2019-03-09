var http = require('http');
var app = require('./app');

var server = http.createServer(app);
var port = 3100;
server.listen(port);
