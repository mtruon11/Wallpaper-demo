const express = require('express');
const router = express.Router();

// Load Tag model
const Tag = require('../../models/Tag');

module.exports = router;

router.get('/', (req, res) => {
    Tag.find({}, (err, doc) => {
        res.status(200).render('./admin/viewTag', {
            user: req.user,
            doc: doc,
            link: "/admin/tags/"
        })
    })
})

router.post('/addTag', (req, res) => {
    let name = req.body.name;
    let errors = [];

    if(!name) {
        errors.push({msg: 'Please enter tag name.'});
    }

    //sanitize input
    name = validation.escape(name);

    if (errors.length > 0) {
        res.render('./admin/viewTag', {
            errors,
            name
        });
    } else {
        Tag.findOne({ name: name }).then(tag => {
            if(tag){
                errors.push({ msg: 'Tag name already exists.' });
                res.render('./admin/viewTag', {
                    errors,
                    name
                });
            } else {
                const newTag = new Tag({
                    name: name
                });
                newTag.save().then(tag => {
                    req.flash(
                        'success_msg',
                        'Tag ' + tag.name +' is created.'
                    );
                    res.redirect('/admin/tags');
                }).catch(err => console.log(err));
            }
        });
    }
});

router.delete('/:name', (req, res) => {
    
    Tag.deleteOne({name: req.params.name}, (err, tag) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.name + ' deleted');
            res.redirect('/admin/tags');
        }
    });
});