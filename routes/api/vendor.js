const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForUser, uploadForVendor} = require('../upload');
const validation = require('validator');

// Load Vendor model
const Vendor = require('../../models/Vendor');

router.get('/', (req, res) => {

    Vendor.find({}, (err, vendors) => {
        res.status(200).json({
            user: req.user,
            vendors: vendors
        })
    })
});

router.post('/', uploadForVendor.single('image'), (req, res) => {
    let name = req.body.name, email = req.body.email, company = req.body.company, phone = req.body.phone, address = req.body.address;
    let image = req.file;

    //sanitize input
    name = validation.escape(name);
    email = validation.escape(email);
    company = validation.escape(company);
    phone = validation.escape(phone);
    address = validation.escape(address);

    //Validate email
    email = validation.normalizeEmail(email, [
        'all_lowercase', 'gmail_remove_dots','gmail_remove_subaddress', 'gmail_convert_googlemaildotcom', 
        'outlookdotcom_remove_subaddress', 'yahoo_remove_subaddress', 'icloud_remove_subaddress'
        ])
    
    Vendor.findOne({ email: email }).then(vendor => {
        if (vendor) {
            errors.push({ msg: 'Email already exists.' });
            res.json({
                user: req.user, 
                name: name,
                email: email,
                company: company,
                address: address,
                phone: phone,
                image: image
            });
        } else {
            const newVendor = new Vendor({
                name: name,
                email: email,
                company: company,
                address: address,
                phone: phone,
                imageUrl: 'https://wallpaper-demo.s3.amazonaws.com/public/images/vendors/' + image.originalname
            });
            newVendor.save().then(vendor => {
                return res.json({
                    error: false, 
                    message: 'successfully added!',
                    vendor: vendor
                })
            }).catch(err => {
                return res.json({
                    error: true,
                    message: 'something wrong!'
                })
            });
        }
    });
});

router.delete('/', (req, res) => {
    
    Vendor.deleteOne({_id: req.body.id}, (err, vendor) => {
        if(err) {
            return res.json({
                "error":  true,
                "message": "something wrong"
            })
        } else {
            return res.json({
                "error": false,
                "message": "successfully delete"
            })
        }
    });
});


module.exports = router;