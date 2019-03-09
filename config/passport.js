const LocalStrategy = require('passport-local').Strategy,
     mongoose = require('mongoose'),
     bcrypt = require('bcryptjs'),
     User = require("../models/user");

     module.exports = function(passport){
         passport.use(
             new LocalStrategy({username:"username"},(username,password,done)=>{
                console.log("username: " + username);
                 User.findOne({username: username})
                    .then(user =>{
                        if(!user){
                            return done(null,false,{message: "Incorrect Username"})
                        }

                        // //compare pass
                        // console.log("user password: " + password);
                        bcrypt.compare(password, user.password,(err,isMatch)=>{
                            if(err) throw err;
                            if(isMatch){
                                return done(null,user);
                            }else{
                                return done(null,false,{message: "Incorrect password"})
                            }
                        })
                    })
                    .catch(err=>  console.log(err));
             })

        );

        passport.serializeUser((user, done)=> {
            console.log(user._id)
            done(null, user._id);
          });
          
          passport.deserializeUser(function(req,id, done) {
            console.log('deserialize:' + id)
            User.findOne({_id: id}, (err, user) => {
            console.log(user);
                if(err) {
                    console.log(err);
                    return done(err);
                }
                return done(err, user);
            });
        });
    };


  

    