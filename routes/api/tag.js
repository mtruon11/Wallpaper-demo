const express = require('express');
const router = express.Router();
const validation = require('validator')

// Load Category model
const Tag = require('../../models/Tag');

module.exports = router;


router.get('/', function(req, res) {
    Tag.find({}, (err, tags) => {
        return res.json({
            "tags": tags
        })
    })
})

router.post('/', function(req, res){
    let name = req.body.name;

    if(!name) {
        return res.json({
            'error': true,
            'message': 'Enter category name'
        })
    }

    //sanitize input
    name = validation.escape(name);

    const newTag = new Tag({
        name: name
    });
    newTag.save().then(tag => {
       return res.json({
            'error': false,
            'message': tag.name + 'added successfully!',
            'tag': tag
       }) 
    }).catch(err => {
        return res.json({
            'error': true,
            'message': 'some error'
        })
    });
})

router.delete('/', (req, res) => {
    let id = req.body.id;

    Tag.deleteOne({_id: id}, (err, tag) => {
        if(err) {
            return res.json({
                'error': true,
                'message': 'Category does not exist!'
            })
        } else {
            return res.json({
                'error': false,
                'message': 'Successfully delete!'
            });
        }
    });
});