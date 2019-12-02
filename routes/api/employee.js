const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForEmployee, uploadForVendor} = require('../upload');
const validation = require('validator');
const bcrypt = require('bcryptjs');


//Load User model
const User = require('../../models/User');

router.get('/', (req, res) => {
    User.find({$or: [{role: 'Admin'}, {role: 'Employee'}] }, (err, employees) => {
        res.status(200).json({
            user: req.user,
            employees: employees,
            link: "/admin/employees/"
        })
    })
});

router.delete('/', (req, res) => {
    
    User.deleteOne({_id: req.body.id}, (err, user) => {
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


router.post('/', uploadForEmployee.single('image'), (req, res) => {
    let name = req.body.name, email = req.body.email, password = req.body.password, phone = req.body.phone, address = req.body.address, role = req.body.role;
    let image = req.file;

    //sanitize input
    name = validation.escape(name);
    email = validation.escape(email);
    password = validation.escape(password);
    phone = validation.escape(phone);
    address = validation.escape(address);

    //Validate email
    email = validation.normalizeEmail(email, [
        'all_lowercase', 'gmail_remove_dots','gmail_remove_subaddress', 'gmail_convert_googlemaildotcom', 
        'outlookdotcom_remove_subaddress', 'yahoo_remove_subaddress', 'icloud_remove_subaddress'
        ])
    
    
    User.findOne({ email: email }).then(user => {
        if (user) {
            res.json({
                error: true,
                message: "Email exists",
                user: req.user, 
                name: name,
                email: email,
                password: password,
                phone: phone,
                address: address,
                role: role,
                image: image
            });
        } else {
            const newUser = new User({
                        name: name,
                        email: email,
                        password: password,
                        phone: phone,
                        address: address,
                        role: role,
                        imageUrl: '../../images/employees/' + image.originalname
                    });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => {
                        return res.json({
                            error: false, 
                            message: 'successfully added!',
                            user: user
                        })
                    })
                    .catch(err =>{
                        return res.json({
                            error: true,
                            message: 'something wrong!'
                        })
                    });
                });
            });

        }
    });
});

module.exports = router;