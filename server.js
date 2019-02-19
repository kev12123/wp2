var http = require('http');
var app = require('./app');

var server = http.createServer(app);
var port = 80;
server.listen(port);
