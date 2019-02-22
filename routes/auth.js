var express = require('express');
var bodyParser = require('body-parser');
var dataBase = require('../database.js');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false});
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://130.245.170.206:27017/wp2',{ useNewUrlParser: true });

var db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error: '));

db.once('open', function(){

    console.log("we are connected");
});


router.get("/",function(req,res){
    
    res.render("signin");
});



router.post("/adduser", jsonParser, function(req,res){
    
    var userName = req.body.username;
    var eMail = req.body.email;
    var passWord = req.body.password;

    console.log("username:" + un + "email:" + e + "password:" + p);


        var user = {
            username: userName,
            email: eMail,
            password: passWord,
            validated: 0
        }
        
    dataBase.User.create(user,function(err,user){

        if(err){
            res.status(400).send();
        }else{
            console.log("SUCESS----------user created");
            res.status(201).send();
        }
    });


 
});


router.post("/verify",jsonParser,function(req,res){
    
    console.log("verify route ....");
    var email_u = req.body.email;
    var key = req.body.key;

    if(key === "abracadabra"){

        var conditions = { email: email_u}
    , update = { $set: { validated: 1 }}


    console.log("validating user ....");

        dataBase.User.update(conditions, update, function(err,numOfUpdatedRecords){
            
            if(err){
                console.log("unable to update records");
                res.status(400).send();
            }
            else{
                console.log("record successfully updated")
                res.status(201).send();
            }
        });

   
    }
    else{

        res.status(400).send();

    }
});


router.post("/login",jsonParser,function(req,res){
   console.log("login route......");
   var userName = req.body.username;
   var passWord = req.body.passWord;

   if(typeof userName !== 'undefined' && typeof passWord === 'undefined'){
    
      //check if user is validated
      console.log("checking if user is validated");
      dataBase.User.find({ username: userName }, 'password validated', function (err, record) {
          
        if(err){
            console.log("User does not exist");
            res.status(400).send();
        }else{
            if(record[0].password === passWord && record[0].validated === 1){

                var date = new Date();
                var curr_date = date.getFullYear() +"-0"+ (date.getMonth() +1) + "-" + date.getDate();
                    res.render("ttt",{
                        name: userName,
                        date: curr_date
                
                });
            }
        }
          
       });
   }
});

module.exports = router; 