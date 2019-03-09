
const express = require("express"),
      app = express(),
      mongoose = require('mongoose'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      passport = require('passport'),
      bodyParser = require('body-parser');
      cookieParser = require('cookie-parser');

var DB  = require('./config/data').MongoConnString;      
mongoose.connect(DB,{ useNewUrlParser: true });

var db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error: '));

db.once('open', function(){

    console.log("we are connected");
});

require('./config/passport')(passport);

app.use(express.static("public"));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");


app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

var routes = require('./routes/play');

app.use('/',routes);


module.exports = app;
