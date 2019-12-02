const express = require('express');
const router = express.Router();

// Load Category model
const Category = require('../../models/Category');

module.exports = router;

router.get('/', (req, res) => {
    Category.find({}, (err, doc) => {
        res.status(200).render('./admin/viewCategory', {
            user: req.user,
            doc: doc,
            link: "/admin/categories/",
        })
    })
})
