var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user.js');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false});
var router = express.Router();



var nodermailer = require('nodemailer');

let transporter = nodermailer.createTransport({
    service: 'Gmail',
    secure: false,
    port: 25,
    auth:{
        user: 'kevinngiraldo@gmail.com',
        pass: 'Init12123.'
    },
    tls: {
        rejectUnathorized: false
    }
});



router.get("/",function(req,res){
    
    res.render("signin");
});



router.post("/adduser", jsonParser, function(req,res){
    
    console.log(res.body)
    var userName = req.body.username;
    var eMail = req.body.email;
    var passWord = req.body.password;

    console.log("username:" + userName + "email:" + eMail+ "password:" + passWord);


        var user = {
            username: userName,
            email: eMail,
            password: passWord,
            validated: 0
        }
        
    User.create(user,function(err,user){

        if(err){
            res.status(400).send();
        }else{
            console.log("SUCCESS----------user created");
            let HelperOptions = {
                from: '"WP2 tic tac toe" <kevinngiraldo.com>',
                to:"kevinngiraldo@gmail.com",
                subject: "Verify email for tic-tac-toe",
                html: "<p><a href='http://localhost:80/verify?email=rerree@fdfdf.com&key=abracadabra'> verify with following link </a></p>"
            }

            transporter.sendMail(HelperOptions,(err,info) => {
                if(err){
                    console.log(err);
                }
                console.log("message was sent");
                console.log(info);
            });

            req.session.userId = user.id;
            console.log(req.session.userId);
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

        User.update(conditions, update, function(err,numOfUpdatedRecords){
            
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


router.get("/verify",urlEncodedParser,function(req,res){
    
    console.log("verify route ....");
    var email_u = req.query.email;
    console.log(email_u);
    var key = req.query.key;
    console.log(key);

    if(key === "abracadabra"){

        var conditions = { email: email_u}
    , update = { $set: { validated: 1 }}


    console.log("validating user ....");

        User.update(conditions, update, function(err,numOfUpdatedRecords){
            
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
      User.find({ username: userName }, 'password validated', function (err, doc) {
          
        if(err){
            console.log("User does not exist");
            res.status(400).send();
        }else{
            //
        }
          
       });
   }
});

module.exports = router; 