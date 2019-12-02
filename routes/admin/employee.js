const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForEmployee, uploadForVendor} = require('../upload');
const validation = require('validator');
const bcrypt = require('bcryptjs');

//Load User model
const User = require('../../models/User');

router.get('/viewEmployee', (req, res) => {
    User.find({$or: [{role: 'Admin'}, {role: 'Employee'}] }, (err, doc) => {
        res.status(200).render('./admin/viewEmployee', {
            user: req.user,
            doc: doc,
            link: "/admin/employees/"
        })
    })
});

router.get('/addEmployee', (req, res) => {
    res.render("./admin/employeeForm", {
        user: req.user
    })
});


module.exports = router;
