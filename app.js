var express = require("express");
var bodyParser = require('body-parser');
var app = express();


var playRoutes = require('./routes/play');
var authRoutes = require('./routes/auth');

app.use('/',playRoutes);
app.use('/',authRoutes);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));


module.exports = app;
