const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForUser, uploadForVendor} = require('../upload');
const validation = require('validator');
const bcrypt = require('bcryptjs');

// Load Vendor model
const Vendor = require('../../models/Vendor');

module.exports = router;

router.get('/viewVendor', (req, res) => {
    Vendor.find({}, (err, doc) => {
        res.status(200).render('./admin/viewVendor', {
            user: req.user,
            doc: doc,
            link: "/admin/vendors/"
        })
    })
});

router.get('/addVendor', (req, res) => {
    res.render("./admin/vendorForm");
});

router.post('/addVendor', uploadForVendor.single('image'), (req, res) => {
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
            user: req.user, 
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
                    user: req.user, 
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

router.delete('/:email', (req, res) => {
    
    Vendor.deleteOne({email: req.params.email}, (err, vendor) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.email + ' deleted');
            res.redirect('/admin/vendors/viewVendor');
        }
    });
});