const express = require('express');
const router = express.Router();
const validation = require('validator')
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});
// Load Category model
const Category = require('../../models/Category');

module.exports = router;

router.delete('/:name', (req, res) => {
    
    Category.deleteOne({name: req.params.name}, (err, category) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.name + ' deleted');
            res.redirect('/admin/categories');
        }
    });
});

router.use(csrfProtection);

router.get('/', (req, res) => {
    Category.find({}, (err, doc) => {
        res.status(200).render('./admin/viewCategory', {
            user: req.user,
            doc: doc,
            link: "/admin/categories/",
            csrfToken: req.csrfToken()
        })
    })
})

router.post('/addCategory', (req, res) => {
    let name = req.body.name;
    let errors = [];

    if(!name) {
        errors.push({msg: 'Please enter category name.'});
    }

    //sanitize input
    name = validation.escape(name);

    if (errors.length > 0) {
        res.render('./admin/viewCategory', {
            errors,
            name,
            csrfToken: req.csrfToken()
        });
    } else {
        Category.findOne({ name: name }).then(category => {
            if(category){
                errors.push({ msg: 'Category name already exists.' });
                res.render('./admin/viewCategory', {
                    errors,
                    name,
                    csrfToken: req.csrfToken()
                });
            } else {
                const newCategory = new Category({
                    name: name
                });
                newCategory.save().then(category => {
                    req.flash(
                        'success_msg',
                        'Category ' + category.name +' is created.'
                    );
                    res.redirect('/admin/categories');
                }).catch(err => console.log(err));
            }
        });
    }
});

