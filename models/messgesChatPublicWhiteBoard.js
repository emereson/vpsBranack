const mongoose = require('mongoose');

const Schema = mongoose.Schema;




const MessgesChatPublicWhiteBoard = new Schema({
    roomid: {type:String },
    message:{type:String },
    autorid:{type:String },
    name:{type:String },
    avatar:{type:String },
    avatarStatus:  {type:Boolean , default: false},
    color:{type:String },
    isAdmin:  {type:Boolean , default: false},
    private:{type:Boolean , default: false},
    recipient:{type:String, default: null }
 
} , {timestamps: true});




module.exports = mongoose.model('MessgesChatPublicWhiteBoard', MessgesChatPublicWhiteBoard);
