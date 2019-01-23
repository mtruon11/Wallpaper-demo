var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    paymentId: {
        type: String,
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