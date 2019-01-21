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
    phone:{
        type: Number,
        required: false
    },
    address:{
        type: String,
        required: false
    },
    role:{
        type: Array,
        default: ['User'],
        required: true
    },
    imageUrl:{
        type: String,
        required: false
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