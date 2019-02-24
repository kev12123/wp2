var express = require('express');
var bodyParser = require('body-parser');
var jsonparser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: true});
var router = express.Router();
var User = require('../models/user.js');
var Game = require('../models/game.js');
var nodermailer = require('nodemailer');
var user_session;

//tiac-tac-toe board
var serve_grid = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ];

//limiting possible moves a cpu can make 
var posCpuPlay ={
    0 : [1,3,4],
    1 : [0,2,3,4,5],
    2 : [1,4,5],
    3 : [0,1,4,6,7],
    4 : [0,1,2,3,5,6,7,8],
    5 : [1,2,4,7,8],
    6 : [3,4,7],
    7 : [3,4,5,6,8],
    8 : [4,5,7]
};


function resetGame(){
    for(var i = 0 ; i < serve_grid.length ; i++){
        serve_grid[i] = ' ';
    }
}

function cpuMove(humanMove,p2){
      for(var i = 0 ; i < serve_grid.length ; i++){  
            if(serve_grid[i]===" " && i !=humanMove){
                serve_grid[i] = p2;
                break;
            }
      }

}

 
function checkWinner(player){

    if (serve_grid[0] === player && serve_grid[1] === player && serve_grid[2] === player ||
        serve_grid[3] === player && serve_grid[4] === player && serve_grid[5] === player ||
        serve_grid[6] === player && serve_grid[7] === player && serve_grid[8] === player ||
        serve_grid[0] === player && serve_grid[3] === player && serve_grid[6] === player ||
        serve_grid[1] === player && serve_grid[4] === player && serve_grid[7] === player ||
        serve_grid[2] === player && serve_grid[5] === player && serve_grid[8] === player ||
        serve_grid[0] === player && serve_grid[4] === player && serve_grid[8] === player ||
        serve_grid[6] === player && serve_grid[4] === player && serve_grid[2] === player){
         
        return true;
  }
  else{

        return false;
  }

}

var redirectToLogin = (req,resp,next)=>{

    if(!req.session.userId){

            resp.redirect('/login');
    }else{
            next();
    }
};

var redirectToTTT = (req,resp,next)=>{

        if(req.session.userId){

                resp.redirect('/ttt');
        }else{
                next();
        }
};

router.get("/ttt",redirectToLogin,function(req,res){
        var date = new Date();
	var curr_date = date.getFullYear() +"-0"+ (date.getMonth() +1) + "-" + date.getDate();
        //deserialize user
        console.log(req.session);
        User.find({ _id: req.session.userId }, 'username', function (err, user) {
                  
                if(err){
                    console.log("User does not exist");
                    res.render("login",{message:"account has not been verified"});
                }else{
                    //check username and password
                    console.log("Found user " + user[0]);
                    if(typeof user[0].username  !== 'undefined'){
                        
                        res.render("ttt",{
	
                                name: user[0].username,
                                date: curr_date
                        
                        });
                    }
                }
                  
               });
});


// router.post("/ttt",function(req,res){
//         var date = new Date();
// 	var curr_date = date.getFullYear() +"-0"+ (date.getMonth() +1) + "-" + date.getDate();
//         //deserialize user
//         User.find({ _id: req.session.userId }, 'username', function (err, user) {
                  
//                 if(err){
//                     console.log("User does not exist");
//                     res.render("login",{message:"account has not been verified"});
//                 }else{
//                     //check username and password
//                     console.log("Found user " + user[0].username);
//                     if(typeof user[0].username  !== 'undefined'){
                        
//                         res.render("ttt",{
	
//                                 name: user[0].username,
//                                 date: curr_date
                        
//                         });
//                     }
//                 }
                  
//                });

     
      
// });


router.post("/ttt/play/",function(req,res){
    
    var p1 = 'x';
    var cpu ='o';
    var move = req.body.move;
    serve_grid[move] = p1;
    console.log(serve_grid);
    console.log(move);
    if(checkWinner(p1) === true){
        resetGame();
        return res.status(200).send({grid: serve_grid , winner: p1});
    }
    else {
        console.log("cpu making move ...");
        console.log("cpu making move ...");
        cpuMove(move,cpu);
        if(checkWinner(cpu) === true){
            console.log("cpu wins !!! lol");
            resetGame();
            return res.status(200).send({grid: serve_grid , winner: cpu});
        }
        
       
    }
    return res.status(200).send({grid: serve_grid , winner: " "});
    
    

    // var ttt_grid = new Array(8);
    // console.log("Start");
    // if(typeof move !== 'undefined'){

    //     var posCpuPlay ={
    //         0 : [1,3,4],
    //         1 : [0,2,3,4,5],
    //         2 : [1,4,5],
    //         3 : [0,1,4,6,7],
    //         4 : [0,1,2,3,5,6,7,8],
    //         5 : [1,2,4,7,8],
    //         6 : [3,4,7],
    //         7 : [3,4,5,6,8],
    //         8 : [4,5,7]
    //     };
   
    //     var p1 = 'x';
    //     var p2 = 'o';
    //     //add human move position
    //     ttt_grid[move] = p1;
    //     console.log("move made by human : " +  move);
    //     console.log(ttt_grid);

    //     //tic tac toe logic
    //     if(checkWinner(p1,ttt_grid)===true){
    //             console.log("checking winner");
    //             console.log(ttt_grid);
    //             res.status(200);
    //             return res.send({grid: resetGame(ttt_grid), winner: p1});
    //        }
    //     }else{  
    //              console.log("no winner");
    //              res.status(200);
    //              return res.send({grid: ttt_grid , winner: " "});
    //     }

});


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

router.post("/adduser",(req,res)=>{
    
    var userName = req.body.username;
    var eMail = req.body.email;
    var passWord = req.body.password;
    

    console.log(req.session);
    console.log("username:" + userName + "email:" + eMail+ "password:" + passWord);


        var user = {
            username: userName,
            email: eMail,
            password: passWord,
            validated: 0
        }
        
    User.create(user,function(err,user){

        if(err){
            res.status(400).redirect("/");
        }else{
            console.log("SUCCESS----------user created");
            let HelperOptions = {
                from: '"WP2 tic tac toe" <kevinngiraldo.com>',
                to: eMail,
                subject: "Verify email for tic-tac-toe",
                html: "<p><a href='http://localhost:3000/verify?email=rerree@fdfdf.com&key=abracadabra'> verify with following link </a></p>"
            }

            transporter.sendMail(HelperOptions,(err,info) => {
                if(err){
                    console.log(err);
                }
                console.log("message was sent");
                console.log(info);
            });

      
            return res.redirect("/login");
        }
    });
  
});


router.post("/verify",function(req,res){
    
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


router.get("/verify", redirectToTTT, urlEncodedParser,function(req,res){
    
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
                return res.status(201).redirect("/login");
            }
        });

   
    }
    else{

        res.status(400).send();

    }
});



router.post("/login",urlEncodedParser,function(req,res){
        console.log("login route......");
        var userName = req.body.username;
        user_session = req.body.username;
        var passWord = req.body.password;
        console.log(userName);
        console.log(passWord);
        if(typeof userName !== 'undefined' && typeof passWord !== 'undefined'){
           //check if user is validated
           console.log("checking if user is validated");
           User.find({ username: userName }, 'password validated _id', function (err, user) {
                  
             if(err){
                 console.log("User does not exist");
                 res.render("login",{message:"account has not been verified"});
             }else{
                 //check username and password
                 if(user[0].password===passWord && user[0].validated===1){
                        req.session.userId = user[0]._id;
                        console.log(req.session);
                        // var date = new Date();
                        // var curr_date = date.getFullYear() +"-0"+ (date.getMonth() +1) + "-" + date.getDate();
                        // res.render("ttt",{
	
                        //         name: userName,
                        //         date: curr_date
                        
                        // });
                        //add game to database
                    
    
                        
                 }else{
                       
                      
                 }

                 return res.redirect("/ttt");
                  
             }
               
            });
        }
});



router.get("/login", redirectToTTT,function(req,res){
  res.render("login",{message:""});
});

router.get("/logout", function(req,res){
    console.log("hereeeee");
    console.log(user_session);

    User.find({ username: "talendo" }, 'password validated _id', function (err, user) {
                  
        if(err){
            console.log("User does not exist");
            res.render("login",{message:"account has not been verified"});
        }else{
            //check username and password
            
                   req.session.userId = user[0]._id;
                   console.log(req.session);
                   req.session.destroy((err)=>{
                       if(err){
                           console.log(err);
                       }else{
                           return res.redirect("/login");
                       }
                   });
                 
  
        }
          
       });
   
});
module.exports = router;
