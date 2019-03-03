const express = require('express');
const router = express.Router();
const validation = require('validator');
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});
// Load Color model
const Color = require('../../models/Color');

module.exports = router;

router.delete('/:name', (req, res) => {
    
    Color.deleteOne({name: req.params.name}, (err, color) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.name + ' deleted');
            res.redirect('/admin/colors');
        }
    });
});

router.use(csrfProtection);

router.get('/', (req, res) => {
    Color.find({}, (err, doc) => {
        res.status(200).render('./admin/viewColor', {
            user: req.user,
            doc: doc,
            link: "/admin/colors/",
            csrfToken: req.csrfToken()
        })
    })
})

router.post('/addColor', (req, res) => {
    let name = req.body.name;
    let errors = [];

    if(!name) {
        errors.push({msg: 'Please enter color name.'});
    }

    //sanitize input
    name = validation.escape(name);

    if (errors.length > 0) {
        res.render('./admin/viewColor', {
            user: req.user, 
            errors,
            name,
            csrfToken: req.csrfToken()
        });
    } else {
        Color.findOne({ name: name }).then(color => {
            if(color){
                errors.push({ msg: 'Color name already exists.' });
                res.render('./admin/viewColor', {
                    user: req.user, 
                    errors,
                    name,
                    csrfToken: req.csrfToken()
                });
            } else {
                const newColor = new Color({
                    name: name
                });
                newColor.save().then(color => {
                    req.flash(
                        'success_msg',
                        'Color ' + color.name +' is created.'
                    );
                    res.redirect('/admin/colors');
                }).catch(err => console.log(err));
            }
        });
    }
});
