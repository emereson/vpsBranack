const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Visitor = new Schema({
    name: {type:String },
    roomid:{type:String},
    avatar:{type:String , default: null},
    avatarStatus: {type:Boolean , default: false},
    isUser : {type:Boolean , default: true},
    statusMessage: { type: Boolean, default: true },
    status: { type: Boolean , default: true }
});

module.exports = mongoose.model('Visitor', Visitor);