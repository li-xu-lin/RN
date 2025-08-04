const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone:String,
    username:String,
    pwd:String,
    imgs:String,
    content:String,
    sex:String,
    birthdate:Date,
    location:String,
});

const User = mongoose.model('User', userSchema,'User');

module.exports = User; 