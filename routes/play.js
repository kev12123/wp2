var express = require('express');
var bodyParser = require('body-parser');
var jsonparser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: true});
var router = express.Router();
var User = require('../models/user.js');
var Game = require('../models/game.js');
var passport = require('passport');
const bcrypt = require('bcryptjs');
var nodermailer = require('nodemailer');

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

function checkTie(p1,p2){
     tie = true;
    for(var i = 0 ; i < serve_grid.length; i++){
        if(serve_grid[i]===" "){
            return false;
        }
    }

    return true;
}

var redirectToLogin = (req,resp,next)=>{

    if(!req.isAuthenticated()){

            resp.redirect('/login');
    }else{
            next();
    }
};

var redirectToTTT = (req,resp,next)=>{

        if(req.isAuthenticated()){

                resp.redirect('/ttt');
        }else{
                next();
        }
};

 

router.get("/ttt", redirectToLogin ,function(req,res){
     
    var date = new Date();
	var curr_date = date.getFullYear() +"-0"+ (date.getMonth() +1) + "-" + date.getDate();
    res.render("ttt",{ name: req.user.username,date: curr_date});

});

router.post("/ttt/play/",function(req,res){
    
    if(!req.isAuthenticated()){
        res.send({status: "ERROR"});
    }
    else{
    var p1 = 'X';
    var cpu ='O';
    var move = req.body.move;
    serve_grid[move] = p1;
    console.log(serve_grid);
    console.log(move);

   
    if(move === null){
        return res.status(200).send({grid: serve_grid , winner: " "});

    }else{
        var conditions = { userId: req.user._id}
        , update = { $push: { game: {grid: serve_grid , winner: " "} } , $inc: { tie: 1 }}
    
    
        console.log("adding game played ....");
    
            Game.update(conditions, update, function(err,numOfUpdatedRecords){
                
                if(err){
                    console.log("unable to update records");
                    res.status(400).send();
                }
                else{
                    console.log("record successfully updated")
                    res.status(200).send();
                }
            });
    if(checkWinner(p1) === true){
        var conditions = { userId: req.user._id}
        , update = { $push: { game: {grid: serve_grid , winner: p1} } , $inc: { human: 1 }}
    
    
        console.log("adding game played ....");
    
            Game.update(conditions, update, function(err,numOfUpdatedRecords){
                
                if(err){
                    console.log("unable to update records");
                    res.status(400).send();
                }
                else{
                    console.log("record successfully updated")
                    res.status(200).send();
                }
            });
        var prev_grid = serve_grid.slice();
        resetGame();
        return res.status(200).send({grid: prev_grid , winner: p1});
    }
    else {
        console.log("cpu making move ...");
        console.log("cpu making move ...");
        cpuMove(move,cpu);
        console.log(serve_grid)
        var conditions = { userId: req.user._id}
        , update = { $push: { game: {grid: serve_grid , winner: " "} } , $inc: { tie: 1 }}
    
    
        console.log("adding game played ....");
    
            Game.update(conditions, update, function(err,numOfUpdatedRecords){
                
                if(err){
                    console.log("unable to update records");
                    res.status(400).send();
                }
                else{
                    console.log("record successfully updated")
                    res.status(200).send();
                }
            });
        if(checkWinner(cpu) === true){
            console.log("cpu wins !!! lol");
            var conditions = { userId: req.user._id}
            , update = { $push: { game: {grid: serve_grid , winner: cpu} } , $inc: { wopr: 1 }}
        
        
            console.log("adding game played ....");
        
                Game.update(conditions, update, function(err,numOfUpdatedRecords){
                    
                    if(err){
                        console.log("unable to update records");
                        res.status(400).send();
                    }
                    else{
                        console.log("record successfully updated")
                        res.status(200).send();
                    }
                });
            var prev_grid = serve_grid.slice();
            resetGame();
            return res.status(200).send({grid: prev_grid , winner: cpu});
           
        }
        
       
    }
    if(checkTie(p1,cpu)){

        var conditions = { userId: req.user._id}
        , update = { $push: { game: {grid: serve_grid , winner: " "} } , $inc: { tie: 1 }}
    
    
        console.log("adding game played ....");
    
            Game.update(conditions, update, function(err,numOfUpdatedRecords){
                
                if(err){
                    console.log("unable to update records");
                    res.status(400).send();
                }
                else{
                    console.log("record successfully updated")
                    res.status(200).send();
                }
            });
            var prev_grid = serve_grid.slice();
            resetGame();
        return res.status(200).send({grid: prev_grid , winner: " "});

    }
    return res.status(200).send({grid: serve_grid , winner: " "});
}
    }
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


router.get("/reset",(req,res)=>{
    resetGame();
    console.log("grid reset" + serve_grid);
    res.send({"status": "ok"})
});

router.get("/",function(req,res){
    
    res.render("signin");
});

router.post('/adduser',(req, res) => {
    const {username, email , password} = req.body;
    
    console.log("username:" + username + "email:" + email+ "password:" + password);
    //Creates and saves a new user with a salt and hashed password
    User.findOne({username: username})
            .then(user=>{
                if(user){
                  res.send({Status: "ERRROR"});
                }else{

                    const user = new User({
                        username,
                        email,
                        password
                    });
                      user.save()
                        .then(user =>{

                            games= new Game({
                                userId : user._id
                            });
                            games.save((err,games)=>{
                                if(err){
                                    console.log(err);
                                }
                                console.log("game rec created " +  games)
                            });
                        console.log("SUCCESS----------user created");
                        let HelperOptions = {
                            from: '"WP2 tic tac toe" <kevinngiraldo.com>',
                            to: email,
                            subject: "Verify email for tic-tac-toe",
                            html: "<p><a href='http://localhost:3000/verify?email="+ email +"&key=abracadabra'> verify with following link </a></p>"
                        }

                        transporter.sendMail(HelperOptions,(err,info) => {
                            if(err){
                                console.log(err);
                            }
                            console.log("message was sent");
                            console.log(info);
                        });  
                           
                            res.send({status:"OK"});
                        })
                        .catch(err => console.log(err));
    
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
                console.log("unable to update records"); var conditions = { email: email_u}
    , update = { $set: { validated: 1 }}


    console.log("validating user ....");

        User.update(conditions, update, function(err,numOfUpdatedRecords){
            
            if(err){
                console.log("unable to update records");
                res.send({status:"ERROR"});
            }
            else{
                console.log("record successfully updated")
                res.send({status:"OK"});
            }
        });

                res.status(400).send();
            }
            else{
                console.log("record successfully updated")
                res.send({status:"OK"});
            }
        });

   
    }
    else{

        res.send({status:"ERROR"});

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
                //res.status(400).send();
                res.send({status:"ERROR"});
            }
            else{
                console.log("record successfully updated")
            ;
                //return res.status(201).redirect("/login");
            }
        });

   
    }
    else{

        res.send({status:"ERROR"});

    }
});

router.post("/login",redirectToTTT,(req,res,next)=>{
    console.log("logging in ");
    console.log(req.body.username + "USERNAMEEE");
    User.findOne({username: req.body.username},'username password validated', (err, user) => {
        console.log(user.validated);
            if(err) {
                console.log(err);
                console.log("user doesnt exist");
                res.render("login",{message:"User does not exist"});
            }
            else{
                 console.log(user.validated);
                if(user===null){
                    console.log(user);
                     //res.status(400);
                     //res.render("login",{message:"User doesnt exist"});
                     res.send({status:"ERROR"});
                }
                else if(user.validated ===1 &&req.body.password === user.password ){
                    console.log("Trying to login")
                    req.login(user, function(err) {
                        if (err) { return res.send({status: "ERROR"})}
                        return res.send({status: "OK"});
                      });
                }else{

                    return res.send({status: "ERROR"});
                }
               
            }
        });
    
});


router.get("/login", redirectToTTT,function(req,res){
  res.status(200);
  res.render("login",{message:""});
});

router.get("/logout",redirectToLogin,(req,res)=>{

     req.logout();
     req.session.destroy();
     res.send({status:"OK"});
     //res.redirect("/login");
});
   
router.post("/logout",(req,res)=>{
     req.logout();
    req.session.destroy();
    res.send({status:"OK"});
    //res.redirect("/login");
});

router.post("/listgames",(req,res)=>{
    console.log(req.isAuthenticated());
   //query to list all games for current user
    Game.find({userId: req.user._id}, function (err, docs) {
        if(err){
             res.status(400).send();
            }else{
                res.status(200).send({status:"OK",games: docs[0].game});
            }
        });

});

router.post("/getgame",(req,res)=>{
    //query to get game based of id
    var id = req.body.id;
    Game.find({'game._id' : id} ,{'game.$': 1}, function (err, games) {

        if(err){
            res.status(400).send();
        }else{
            res.status(200).send({status:"OK",grid:games[0].game[0].grid ,winner:games[0].game[0].winner});
        }
   });
 });
 
 router.post("/getscore",(req,res)=>{
     //query to get score of human vs cpu
     Game.find({userId: req.user._id}, function (err, game) {
        if(err){
            res.status(400).send();
        }else{
            res.status(200).send({status:"OK",human: game[0].human , wopr: game[0].wopr , tie: game[0].tie});
        }
   });
 });
    

module.exports = router;
