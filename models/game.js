var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({

    games:[{

        id: String,
        start_date: String,
        grid: Array,
        winner:String,

    }],
    human: {type: Number , default: 0},
    wopr: {type: Number , default: 0},
    tie: {type: Number , default: 0},
    userId: String

});

var Game = mongoose.model('Game',GameSchema);
module.exports = Game;