var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    
    orderedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    couponID: {
        type: Object,
        required: false
    }, 
    sessionID: {
        type: Object,
        required: true
    },
    customerID: {
        type: Object,
        required: true
    },
    createdOn: {
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
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;