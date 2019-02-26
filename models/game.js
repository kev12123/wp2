var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    start_date: {type: Date, default: Date.now},
    grid: Array,
    winner:String,
})
var GamesSchema = new Schema({

    game:[GameSchema],
    human: {type: Number , default: 0},
    wopr: {type: Number , default: 0},
    tie: {type: Number , default: 0},
    userId: String

});

var Game = mongoose.model('Game',GamesSchema);
module.exports = Game;