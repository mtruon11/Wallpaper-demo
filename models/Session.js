var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({

    data: {
        type: String,
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

const Sessions = mongoose.model('Sessions', sessionSchema);

module.exports = Sessions;