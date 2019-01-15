var mongoose = require('mongoose');

var vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    company: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
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

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;