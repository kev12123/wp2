var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://130.245.170.206:27017/wp2',{ useNewUrlParser: true });

var db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error: '));

db.once('open', function(){

    console.log("we are connected");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
  });
  

const{
    SESSION_LIFETIME = 1000*60*60*2,
    SESSION_SECRET = 'ssh!quiet,it\'asecret!',
    SESSION_NAME = 'sid'
} = process.env;

app.use(session({
    name: SESSION_NAME,
    store: new MongoStore({  mongooseConnection: db } ),
    saveUninitialized: true,
    resave: true,
    secret: SESSION_SECRET,
    cookie: { //http only by default
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: false
    },
    unset: 'destroy'

}));

var routes = require('./routes/play');

app.use('/',routes);


module.exports = app;
