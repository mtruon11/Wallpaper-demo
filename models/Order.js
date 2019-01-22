var mongoose = require('mongoose');


var orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    customerID: {
        type: Object,
        required: false
    },
    paymentId: {
        type: Object,
        required: true
    },
    cart: {
        type: Object,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    orderedDate: {
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