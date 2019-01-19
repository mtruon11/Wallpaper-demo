const express = require('express');
const router = express.Router();
const passport = require('passport');
const {ensureLoggedOut} = require('connect-ensure-login');
const {uploadProduct, uploadForEmployee, uploadForVendor} = require('../upload');
const validation = require('validator');
const bcrypt = require('bcryptjs');
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

// Login Page
router.get('/login', ensureLoggedOut('/'), (req, res) => {
    res.render('./admin/login', {
        csrfToken: req.csrfToken()
    });
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successReturnToOrRedirect: '/admin',
        failureRedirect: '/employees/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/employees/login');
});

router.get('/employees/viewEmployee', (req, res) => {
    User.find({}, (err, doc) => {
        res.status(200).render('./admin/viewEmployee', {
            user: req.user,
            doc: doc,
            link: "/admin/employees/"
        })
    })
});

router.get('/addEmployee', (req, res) => {
    res.render("../admin/employeeForm");
});

router.post('/addEmployee', uploadForEmployee.single('image'), (req, res) => {
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
        res.render('./admin/UserForm', {
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
        User.findOne({ email: email }).then(User => {
            if (User) {
                errors.push({ msg: 'Email already exists.' });
                res.render('./admin/UserForm', {
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
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: address,
                    role: role,
                    imageUrl: '/images/employees/' + image.filename
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
                        res.redirect('/admin/employees/viewEmployee');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

router.delete('/:email', (req, res) => {
    
    User.deleteOne({email: req.params.email}, (err, User) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.email + ' deleted');
            res.redirect('/admin/employees/viewEmployee');
        }
    });
});

module.exports = router;
