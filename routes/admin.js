const express = require('express');
const router = express.Router();
const ensureLog = require("connect-ensure-login");
const {upload, uploadForUsers} = require('./upload');
const validation = require('validator');
const bcrypt = require('bcryptjs');

// Load Product model
const Product = require('../models/Product');
// Load User model
const User = require('../models/User');

router.get('/', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.status(200).render('./admin/dashboard', {
        user: req.user
    })
);

router.get('/product', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    
    Product.find({}, async (err,data) => {
        if(data){

            var total;
            var onStock;
            var outOfStock;

            await Product
                .countDocuments({}, (err, count) => {
                    total = count;
                });
                
            await Product
                .countDocuments({quantity: {$gt: 0}}, (err, count) => {
                    onStock = count;
                });

            await Product
                .countDocuments({quantity: {$eq: 0}}, (err, count) => {
                    outOfStock = count;
                });

            res.status(200).render('./admin/viewProduct', {
                user: req.user,
                total: total,
                onStock: onStock,
                outOfStock: outOfStock,
                data: data,
                link: "/admin/product/"
            })
        }
    });
});

router.get('/product/addProduct', ensureLog.ensureLoggedIn("/users/login"), async (req, res) => {
    var total;
    var onStock;
    var outOfStock;

    await Product
        .countDocuments({}, (err, count) => {
            total = count;
        });
        
    await Product
        .countDocuments({quantity: {$gt: 0}}, (err, count) => {
            onStock = count;
        });

    await Product
        .countDocuments({quantity: {$eq: 0}}, (err, count) => {
            outOfStock = count;
        });

    res.status(200).render('./admin/productForm', {
        user: req.user,
        total: total,
        onStock: onStock,
        outOfStock: outOfStock
    })
});

router.post('/product/addProduct', ensureLog.ensureLoggedIn("/users/login"), upload.array('images'), async (req, res) => {
    const {sku, name, description, quantity, regularPrice, 
        discountPrice, tags, categories} = req.body;
    const images = req.files;
    let errors = [];
    let imageUrl = [];

    if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        || !tags || !categories ) {
            errors.push({msg: 'Please enter all fields.'});
    }

    if(images.length == 0){
        errors.push({msg: 'Please upload at least 1 image.'});
    }

    if(quantity <= 0 || regularPrice <= 0 || discountPrice <= 0){
        errors.push({msg: 'Quantity, regular price, and discount price must be greater than 0.'});
    }


    if(errors.length > 0) {
        res.status(404).render('./admin/productForm', {
            errors, sku, name, description, quantity, regularPrice, 
            discountPrice, tags, categories, imageUrl
        });
    } else {
        Product.findOne({sku: sku}).then(product => {
            if(product){
                errors.push({msg: 'Product already existed.'});
                res.status(200).render('./admin/productForm', {
                    errors, sku, name, description, quantity, regularPrice,
                    discountPrice, tags, categories, imageUrl
                });
            } else {

                for(var idx in images){
                    imageUrl.push(images[idx].path);
                }
                
                const newProduct = new Product({
                    sku, name, description, quantity, regularPrice,
                    discountPrice, tags, categories, imageUrl
                });

                newProduct
                .save()
                .then(product => {
                    console.log('Product created.')
                    req.flash(
                        'success_msg',
                        'New product is created.'
                    )
                    res.redirect('/admin/product/addProduct')
                })
                .catch(err => console.log(err));
            }
        })
    }
});

router.delete('/product/:sku', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    
    Product.deleteOne({sku: req.params.sku}, (err, product) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.sku + ' Product deleted');
            res.redirect('/admin/product');
        }
    });
});

router.get('/product/:sku', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {

    Product.findOne({sku: req.params.sku}, async (err, product) => {
        var total;
        var onStock;
        var outOfStock;
    
        await Product
            .countDocuments({}, (err, count) => {
                total = count;
            });
            
        await Product
            .countDocuments({quantity: {$gt: 0}}, (err, count) => {
                onStock = count;
            });
    
        await Product
            .countDocuments({quantity: {$eq: 0}}, (err, count) => {
                outOfStock = count;
            });   
    
        res.render('./admin/editProduct', {
            user: req.user,
            total: total,
            onStock: onStock,
            outOfStock: outOfStock, 
            product: product
        });
    });
    
});

router.post('/product/editProduct', ensureLog.ensureLoggedIn("/users/login"), upload.array('images'), (req, res) => {
    const {sku, name, description, quantity, regularPrice, 
        discountPrice, tags, categories} = req.body;
    const images = req.files;
    let errors = [];
    let imageUrl = [];

    if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        || !tags || !categories ) {
            errors.push({msg: 'Please enter all fields.'});
    }

    if(images.length == 0){
        errors.push({msg: 'Please upload at least 1 image.'});
    }

    if(quantity <= 0 || regularPrice <= 0 || discountPrice <= 0){
        errors.push({msg: 'Quantity, regular price, and discount price must be greater than 0.'});
    }


    if(errors.length > 0) {
        const product = new Product({
            sku, name, description, quantity, regularPrice,
            discountPrice, tags, categories, imageUrl
        });
        res.status(404).render('./admin/editProduct', {
            errors, product
        });
    } else {
        for(var idx in images){
            imageUrl.push(images[idx].path);
        }
        Product.findOneAndUpdate(
            {
                sku: sku
            },
            {
                name: name, description: description, quantity:quantity, regularPrice:regularPrice,
                discountPrice:discountPrice, tags:tags, categories:categories, imageUrl:imageUrl
            },
            {
                upsert:true
            }, 
            (err, product) => {
                if(err){
                    console.log('error while updating');
                    return;
                }
                res.redirect('/admin/product/');
            });
    }
});

router.get('/users/addUser', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    res.render("./admin/userForm");
})

router.post('/users/addUser', ensureLog.ensureLoggedIn("/users/login"), uploadForUsers.single('image'), (req, res) => {
    let {name, email, password, role} = req.body;
    let image = req.file;
    let errors = [];

    if(!name || !email || ! password || !role) {
        errors.push({msg: 'Please enter all fields.'});
    }

    if(!image) {
        errors.push({msg: 'Please upload a photo of yourself.'});
    }

    //sanitize input
    name = validation.escape(name);
    email = validation.escape(email);
    password = validation.escape(password);

    //Validate email
    if(!validation.isEmail(email)){
        errors.push({msg: 'Bad email.'})
    } else {
        email = validation.normalizeEmail(email, [
        'all_lowercase', 'gmail_remove_dots','gmail_remove_subaddress', 'gmail_convert_googlemaildotcom', 
        'outlookdotcom_remove_subaddress', 'yahoo_remove_subaddress', 'icloud_remove_subaddress'
        ])
    } 
    if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters.' });
    }
    
    if (errors.length > 0) {
        res.render('./admin/userForm', {
        errors,
        name,
        email,
        password,
        role,
        image
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists.' });
                res.render('./admin/userForm', {
                    errors,
                    name,
                    email,
                    password,
                    role,
                    image
                });
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                    imageUrl: '/images/users/' + image.filename
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => {
                        req.flash(
                        'success_msg',
                        'You are now registered and can log in.'
                        );
                        res.redirect('/admin/users/viewUser');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

router.get('/users/viewUser', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    User.find({}, (err, doc) => {
        res.status(200).render('./admin/viewUser', {
            user: req.user,
            doc: doc,
            link: "/admin/users/"
        })
    })
});

router.delete('/users/:email', ensureLog.ensureLoggedIn('/users/login'), (req, res) => {
    
    User.deleteOne({email: req.params.email}, (err, user) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.email + ' deleted');
            res.redirect('/admin/users/viewUser');
        }
    });
});

module.exports = router;