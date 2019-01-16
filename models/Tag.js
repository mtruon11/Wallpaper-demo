var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
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

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;