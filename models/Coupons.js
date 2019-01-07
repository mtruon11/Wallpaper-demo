var mongoose = require('mongoose');

var couponSchema = new mongoose.Schema({
    
    code: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    value: {
        type: Number
    },
    multiple: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        default: Date.now
    }, 
    endDate: {
        type: Date,
        default: Date.now
    },
    createOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});


const Coupons = mongoose.model('Coupons', couponSchema);

module.exports = Coupons;