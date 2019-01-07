var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type:String
    },
    status: {
        type: Boolean,
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    taxable: {
        type: Boolean,
        default: false
    },
    tags: {
        type: Array
    },
    categories: {
        type: Array
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;