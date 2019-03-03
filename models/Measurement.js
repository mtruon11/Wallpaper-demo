var mongoose = require('mongoose');

var measureSchema = new mongoose.Schema({
    measure: {
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

const Measurement = mongoose.model('Measurement', measureSchema);

module.exports = Measurement;