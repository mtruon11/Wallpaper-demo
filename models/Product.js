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
        type:String,
        required: false
    },
    quantity:{ 
        type: Number,
        required:true,
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
        type: Number,
        required: false
    },
    taxable: {
        type: Boolean,
        default: false
    },
    tags: {
        type: String,
        required: false
    },
    categories: {
        type: Array,
        required: true
    },
    imageUrl: {
        type: Array,
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;