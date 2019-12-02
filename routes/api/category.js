const express = require('express');
const router = express.Router();
const validation = require('validator')

// Load Category model
const Category = require('../../models/Category');

module.exports = router;


router.get('/', function(req, res) {
    Category.find({}, (err, categories) => {
        return res.json({
            "categories": categories
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

    const newCategory = new Category({
        name: name
    });
    newCategory.save().then(category => {
       return res.json({
            'error': false,
            'message': category.name + 'added successfully!',
            'category': category
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

    Category.deleteOne({_id: id}, (err, category) => {
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