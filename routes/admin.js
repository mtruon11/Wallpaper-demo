const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForEmployee, uploadForVendor} = require('./upload');
const validation = require('validator');
const bcrypt = require('bcryptjs');

module.exports = router;

// Load Product model
const Product = require('../models/Product');
// Load Employee model
const Employee = require('../models/Employee');
// Load Vendor model
const Vendor = require('../models/Vendor');
// Load Category model
const Category = require('../models/Category');
// Load Tag model
const Tag = require('../models/Tag');

router.use('/', (req, res, next) => {
    console.log(req.user);
    if(req.user.role == 'Employee' || req.user.role == 'Admin'){
        next();
    } else {
        req.logout();
        res.status(401).send('Access Denied');
    }
})

// DashBoard
router.get('/', (req, res) => 
    res.status(200).render('./admin/dashboard', {
        user: req.user
    })
);

router.get('/product', (req, res) => {
    
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

router.get('/product/addProduct', async (req, res) => {
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

router.get('/product/:sku', (req, res) => {

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

router.post('/product/addProduct', uploadProduct.array('images'), async (req, res) => {
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
                    imageUrl.push('/images/uploads/' + images[idx].filename);
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

router.post('/product/editProduct', uploadProduct.array('images'), (req, res) => {
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

router.delete('/product/:sku', (req, res) => {
    
    Product.deleteOne({sku: req.params.sku}, (err, product) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.sku + ' Product deleted');
            res.redirect('/admin/product');
        }
    });
});

router.get('/employees/viewEmployee', (req, res) => {
    Employee.find({}, (err, doc) => {
        res.status(200).render('./admin/viewEmployee', {
            user: req.user,
            doc: doc,
            link: "/admin/employees/"
        })
    })
});

router.get('/employees/addEmployee', (req, res) => {
    res.render("./admin/employeeForm");
});

router.post('/employees/addEmployee', uploadForEmployee.single('image'), (req, res) => {
    let {name, email, password, phone, address, role} = req.body;
    let image = req.file;
    let errors = [];

    if(!name || !email || ! password || !phone || !address || !role) {
        errors.push({msg: 'Please enter all fields.'});
    }

    if(!image) {
        errors.push({msg: 'Please upload a photo of yourself.'});
    }

    //sanitize input
    name = validation.escape(name);
    email = validation.escape(email);
    password = validation.escape(password);
    phone = validation.escape(phone);
    address = validation.escape(address);

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
        res.render('./admin/employeeForm', {
            errors,
            name,
            email,
            password,
            phone,
            address,
            role,
            image
        });
    } else {
        Employee.findOne({ email: email }).then(employee => {
            if (employee) {
                errors.push({ msg: 'Email already exists.' });
                res.render('./admin/employeeForm', {
                    errors,
                    name,
                    email,
                    password,
                    phone,
                    address,
                    role,
                    image
                });
            } else {
                const newEmployee = new Employee({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: address,
                    role: role,
                    imageUrl: '/images/employees/' + image.filename
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newEmployee.password, salt, (err, hash) => {
                        if (err) throw err;
                        newEmployee.password = hash;
                        newEmployee
                        .save()
                        .then(user => {
                        req.flash(
                        'success_msg',
                        'You are now registered and can log in.'
                        );
                        res.redirect('/admin/employees/viewEmployee');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

router.delete('/employees/:email', (req, res) => {
    
    Employee.deleteOne({email: req.params.email}, (err, employee) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.email + ' deleted');
            res.redirect('/admin/employees/viewEmployee');
        }
    });
});

router.get('/vendors/viewVendor', (req, res) => {
    Vendor.find({}, (err, doc) => {
        res.status(200).render('./admin/viewVendor', {
            user: req.user,
            doc: doc,
            link: "/admin/vendors/"
        })
    })
});

router.get('/vendors/addVendor', (req, res) => {
    res.render("./admin/vendorForm");
});

router.post('/vendors/addVendor', uploadForVendor.single('image'), (req, res) => {
    let {name, email, company, address, phone } = req.body;
    let image = req.file;
    let errors = [];

    if(!name || !email || !company || !phone || !address) {
        errors.push({msg: 'Please enter all fields.'});
    }

    if(!image) {
        errors.push({msg: 'Please upload a logo of vendor.'});
    }

    //sanitize input
    name = validation.escape(name);
    email = validation.escape(email);
    company = validation.escape(company);
    phone = validation.escape(phone);
    address = validation.escape(address);

    //Validate email
    if(!validation.isEmail(email)){
        errors.push({msg: 'Bad email.'})
    } else {
        email = validation.normalizeEmail(email, [
        'all_lowercase', 'gmail_remove_dots','gmail_remove_subaddress', 'gmail_convert_googlemaildotcom', 
        'outlookdotcom_remove_subaddress', 'yahoo_remove_subaddress', 'icloud_remove_subaddress'
        ])
    } 
    
    if (errors.length > 0) {
        res.render('./admin/vendorForm', {
            errors,
            name,
            email,
            company,
            address,
            phone,
            image
        });
    } else {
        Vendor.findOne({ email: email }).then(vendor => {
            if (vendor) {
                errors.push({ msg: 'Email already exists.' });
                res.render('./admin/vendorForm', {
                    errors,
                    name,
                    email,
                    company,
                    address,
                    phone,
                    image
                });
            } else {
                const newVendor = new Vendor({
                    name: name,
                    email: email,
                    company: company,
                    address: address,
                    phone: phone,
                    imageUrl: '/images/vendors/' + image.filename
                });
                newVendor.save().then(vendor => {
                req.flash(
                    'success_msg',
                    'You are now registered and can log in.'
                );
                res.redirect('/admin/vendors/viewVendor');
                }).catch(err => console.log(err));
            }
        });
    }
});

router.delete('/vendors/:email', (req, res) => {
    
    Vendor.deleteOne({email: req.params.email}, (err, vendor) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.email + ' deleted');
            res.redirect('/admin/vendors/viewVendor');
        }
    });
});

router.get('/categories', (req, res) => {
    Category.find({}, (err, doc) => {
        res.status(200).render('./admin/viewCategory', {
            user: req.user,
            doc: doc,
            link: "/admin/categories/"
        })
    })
})

router.post('/categories/addCategory', (req, res) => {
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
            name
        });
    } else {
        Category.findOne({ name: name }).then(category => {
            if(category){
                errors.push({ msg: 'Category name already exists.' });
                res.render('./admin/viewCategory', {
                    errors,
                    name
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

router.delete('/categories/:name', (req, res) => {
    
    Category.deleteOne({name: req.params.name}, (err, category) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.name + ' deleted');
            res.redirect('/admin/categories');
        }
    });
});


router.get('/tags', (req, res) => {
    Tag.find({}, (err, doc) => {
        res.status(200).render('./admin/viewTag', {
            user: req.user,
            doc: doc,
            link: "/admin/tags/"
        })
    })
})

router.post('/tags/addTag', (req, res) => {
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

router.delete('/tags/:name', (req, res) => {
    
    Tag.deleteOne({name: req.params.name}, (err, tag) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.name + ' deleted');
            res.redirect('/admin/tags');
        }
    });
});

