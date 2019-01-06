var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    createdOn:{
        type: Date,
        default: Date.now
    },
    updatedOn:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;