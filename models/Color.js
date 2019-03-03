var mongoose = require('mongoose');

var colorSchema = new mongoose.Schema({
    name: {
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

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;