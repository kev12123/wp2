const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');


const Schema = mongoose.Schema;

var validateEmail = function(email){

    var regEmail =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regEmail.test(email);
}

function connectToDb(connStr){

    mongoose.connect(connStr,{useNewUrlParser: true});

    return mongoose.connection;
}

var UserSchema = new Schema({

    username: {
            type: String,
            unique:true,
            required: true,
            trim: true
    },
    password: {

        type: String,
        required: true
    },
    email:{
            type:String,
            trim:true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please enter a valid email']
    },
    validated:{
        type: Number , default: 0
    }

});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User',UserSchema);

module.exports = User;