const express = require('express');
const router = express.Router();
const validation = require('validator')

const Color = require('../../models/Color');

module.exports = router;


router.get('/', function(req, res) {
    Color.find({}, (err, colors) => {
        return res.json({
            "colors": colors
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

    const newColor = new Color({
        name: name
    });
    newColor.save().then(color => {
       return res.json({
            'error': false,
            'message': color.name + 'added successfully!',
            'color': color
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

    Color.deleteOne({_id: id}, (err, Color) => {
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