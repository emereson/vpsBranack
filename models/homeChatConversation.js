const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Visitor = require('./homeChatVisitors.js');

const Conversation = new Schema({
    roomid: String,
    textColor: {type: String, default: 'white'},
    message: String,
    autor: { type: Schema.ObjectId, ref: "Visitor" }  
} , {timestamps: true});




module.exports = mongoose.model('Conversation', Conversation);
